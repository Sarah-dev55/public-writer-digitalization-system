import React, { useState } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";

export const LeaveReviewModal = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { name: name || "Anonymous", rating, review, date: new Date().toISOString() };
      await onSubmit(payload);
      setName("");
      setRating(5);
      setReview("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg">
        <CardContent className="p-6">
          <header className="mb-4">
            <h3 className="text-lg font-semibold">Leave a Review</h3>
            <p className="text-sm text-muted-foreground">Share your experience with our writer.</p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col text-sm">
              Review
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="mt-1 p-2 border rounded min-h-[120px]"
                required
                placeholder="Write your review..."
                aria-label="Review text"
              />
            </label>

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose} className="px-4 py-2">Cancel</Button>
              <Button type="submit" className="px-4 py-2" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveReviewModal;