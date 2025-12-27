const ClientArchive = require('../models/ClientArchive');
const User = require('../models/User');
const Document = require('../models/Document');
const Appointment = require('../models/Appointment');

// Get all client archives
async function listAll(req, res) {
  try {
    const archives = await ClientArchive.find()
      .populate('clientId', 'fullName email phone')
      .populate('caseHistory.documents')
      .populate('caseHistory.appointments')
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: archives });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Get single client archive by ID
async function getById(req, res) {
  try {
    const archive = await ClientArchive.findById(req.params.id)
      .populate('clientId', 'fullName email phone')
      .populate('caseHistory.documents')
      .populate('caseHistory.appointments');
    if (!archive) {
      return res.status(404).json({ success: false, message: 'Archive not found' });
    }
    res.json({ success: true, data: archive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Get client archive by client ID
async function getByClientId(req, res) {
  try {
    const archive = await ClientArchive.findOne({ clientId: req.params.clientId })
      .populate('clientId', 'fullName email phone')
      .populate('caseHistory.documents')
      .populate('caseHistory.appointments');
    if (!archive) {
      return res.status(404).json({ success: false, message: 'Archive not found for this client' });
    }
    res.json({ success: true, data: archive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Search archives by client name or case type
async function search(req, res) {
  try {
    const { query, caseType, status, startDate, endDate } = req.query;
    
    let searchCriteria = {};
    
    // Text search for client name or case description
    if (query) {
      searchCriteria.$or = [
        { clientName: { $regex: query, $options: 'i' } },
        { clientEmail: { $regex: query, $options: 'i' } },
        { 'caseHistory.caseType': { $regex: query, $options: 'i' } },
        { 'caseHistory.description': { $regex: query, $options: 'i' } }
      ];
    }
    
    // Filter by case type
    if (caseType) {
      searchCriteria['caseHistory.caseType'] = { $regex: caseType, $options:  'i' };
    }
    
    // Filter by case status
    if (status) {
      searchCriteria['caseHistory.status'] = status;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      searchCriteria['caseHistory.startDate'] = {};
      if (startDate) {
        searchCriteria['caseHistory.startDate'].$gte = new Date(startDate);
      }
      if (endDate) {
        searchCriteria['caseHistory.startDate'].$lte = new Date(endDate);
      }
    }
    
    const archives = await ClientArchive.find(searchCriteria)
      .populate('clientId', 'fullName email phone')
      .populate('caseHistory.documents')
      .populate('caseHistory.appointments')
      .sort({ updatedAt: -1 });
    
    res.json({ success: true, data: archives, count: archives.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Create new client archive
async function create(req, res) {
  try {
    const { clientId, clientName, clientEmail, clientPhone, caseHistory, tags, notes } = req.body;
    
    // Check if archive already exists for this client
    const existingArchive = await ClientArchive.findOne({ clientId });
    if (existingArchive) {
      return res.status(400).json({ 
        success: false, 
        message: 'Archive already exists for this client.  Use update instead.' 
      });
    }
    
    const archive = new ClientArchive({
      clientId,
      clientName,
      clientEmail,
      clientPhone,
      caseHistory:  caseHistory || [],
      totalCases: caseHistory ? caseHistory.length : 0,
      tags,
      notes
    });
    
    await archive.save();
    res.status(201).json({ success: true, data: archive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Create archive from existing user
async function createFromUser(req, res) {
  try {
    const { userId } = req.params;
    
    // Get user data
    const user = await User. findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if archive already exists
    const existingArchive = await ClientArchive.findOne({ clientId: userId });
    if (existingArchive) {
      return res.status(400).json({ 
        success: false, 
        message: 'Archive already exists for this client',
        data: existingArchive
      });
    }
    
    // Get all documents for this user
    const documents = await Document.find({ userId });
    
    // Get all appointments for this user
    const appointments = await Appointment.find({ userId });
    
    // Create initial case history entry if there are documents or appointments
    const caseHistory = [];
    if (documents.length > 0 || appointments.length > 0) {
      caseHistory.push({
        caseType: 'Initial Case',
        description: 'Auto-generated from existing records',
        status: 'open',
        documents: documents.map(d => d._id),
        appointments: appointments. map(a => a._id)
      });
    }
    
    const archive = new ClientArchive({
      clientId: userId,
      clientName: user.fullName,
      clientEmail: user.email,
      clientPhone: user. phone,
      caseHistory,
      totalCases: caseHistory.length
    });
    
    await archive.save();
    
    const populatedArchive = await ClientArchive.findById(archive._id)
      .populate('clientId', 'fullName email phone')
      .populate('caseHistory.documents')
      .populate('caseHistory.appointments');
    
    res.status(201).json({ success: true, data: populatedArchive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Update client archive
async function update(req, res) {
  try {
    const updated = await ClientArchive.findByIdAndUpdate(
      req. params.id, 
      { ... req.body, totalCases: req.body.caseHistory ?  req.body.caseHistory. length : undefined },
      { new: true }
    )
      .populate('clientId', 'fullName email phone')
      .populate('caseHistory.documents')
      .populate('caseHistory.appointments');
    
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Archive not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Add new case to client archive
async function addCase(req, res) {
  try {
    const { id } = req.params;
    const { caseType, description, status, notes, documents, appointments } = req.body;
    
    const archive = await ClientArchive.findById(id);
    if (!archive) {
      return res.status(404).json({ success: false, message: 'Archive not found' });
    }
    
    const newCase = {
      caseType,
      description,
      status:  status || 'open',
      notes,
      documents: documents || [],
      appointments: appointments || []
    };
    
    archive.caseHistory.push(newCase);
    archive.totalCases = archive.caseHistory.length;
    await archive.save();
    
    const updatedArchive = await ClientArchive.findById(id)
      .populate('clientId', 'fullName email phone')
      .populate('caseHistory.documents')
      .populate('caseHistory.appointments');
    
    res.json({ success: true, data: updatedArchive });
  } catch (err) {
    res.status(500).json({ success: false, message: err. message });
  }
}

// Update specific case in archive
async function updateCase(req, res) {
  try {
    const { id, caseId } = req.params;
    const updates = req.body;
    
    const archive = await ClientArchive.findById(id);
    if (!archive) {
      return res.status(404).json({ success: false, message: 'Archive not found' });
    }
    
    const caseIndex = archive.caseHistory.findIndex(c => c._id.toString() === caseId);
    if (caseIndex === -1) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }
    
    // Update case fields
    Object.keys(updates).forEach(key => {
      archive.caseHistory[caseIndex][key] = updates[key];
    });
    
    await archive.save();
    
    const updatedArchive = await ClientArchive.findById(id)
      .populate('clientId', 'fullName email phone')
      .populate('caseHistory.documents')
      .populate('caseHistory.appointments');
    
    res.json({ success: true, data: updatedArchive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Add document to case
async function addDocumentToCase(req, res) {
  try {
    const { id, caseId } = req.params;
    const { documentId } = req.body;
    
    const archive = await ClientArchive.findById(id);
    if (!archive) {
      return res.status(404).json({ success: false, message: 'Archive not found' });
    }
    
    const caseItem = archive.caseHistory.id(caseId);
    if (!caseItem) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }
    
    if (!caseItem.documents.includes(documentId)) {
      caseItem.documents.push(documentId);
      await archive.save();
    }
    
    const updatedArchive = await ClientArchive.findById(id)
      .populate('clientId', 'fullName email phone')
      .populate('caseHistory.documents')
      .populate('caseHistory.appointments');
    
    res.json({ success: true, data: updatedArchive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Get client history (all cases with documents and appointments)
async function getClientHistory(req, res) {
  try {
    const { clientId } = req.params;
    
    const archive = await ClientArchive.findOne({ clientId })
      .populate('clientId', 'fullName email phone')
      .populate('caseHistory.documents')
      .populate('caseHistory.appointments');
    
    if (!archive) {
      return res.status(404).json({ success: false, message: 'No history found for this client' });
    }
    
    // Format the history for easy consumption
    const history = {
      client: {
        id: archive.clientId._id,
        name: archive. clientName,
        email: archive.clientEmail,
        phone: archive. clientPhone
      },
      totalCases: archive.totalCases,
      cases: archive.caseHistory.map(c => ({
        id:  c._id,
        caseType: c.caseType,
        description: c.description,
        status: c.status,
        startDate: c.startDate,
        endDate: c.endDate,
        notes: c.notes,
        documentsCount: c.documents.length,
        documents: c.documents,
        appointmentsCount: c.appointments. length,
        appointments: c. appointments
      })),
      createdAt: archive.createdAt,
      updatedAt: archive. updatedAt
    };
    
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err. message });
  }
}

// Archive/deactivate a client
async function archiveClient(req, res) {
  try {
    const archive = await ClientArchive.findByIdAndUpdate(
      req. params.id,
      { isActive: false, archivedAt: new Date() },
      { new: true }
    );
    
    if (!archive) {
      return res.status(404).json({ success: false, message: 'Archive not found' });
    }
    
    res.json({ success: true, data: archive, message: 'Client archived successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Delete client archive
async function remove(req, res) {
  try {
    const archive = await ClientArchive.findByIdAndDelete(req.params.id);
    if (!archive) {
      return res.status(404).json({ success: false, message: 'Archive not found' });
    }
    res.json({ success: true, message: 'Archive deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message:  err.message });
  }
}

module.exports = {
  listAll,
  getById,
  getByClientId,
  search,
  create,
  createFromUser,
  update,
  addCase,
  updateCase,
  addDocumentToCase,
  getClientHistory,
  archiveClient,
  remove
};