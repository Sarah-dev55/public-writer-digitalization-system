export const DATABASE_REVIEWS = [
  {
    id: 1,
    name: "Mr. John Doe",
    role: "Client",
    review: "Professional, elegant, and modern service. Highly recommended for anyone seeking quality assistance.",
    date: "2024-11-15",
  },
  {
    id: 2,
    name: "Ms. Jane Smith",
    role: "Client",
    review: "Excellent experience from start to finish. The team is responsive and truly cares about their clients.",
    date: "2024-11-10",
  }
];

export const fetchReviews = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...DATABASE_REVIEWS]);
    }, 500);
  });
};

export const getRecentReviews = (reviews, limit = 3) => {
  return reviews.slice(0, limit);
};

export const getAllReviews = (reviews) => {
  return reviews;
};