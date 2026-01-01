import { ArrowRightIcon, QuoteIcon } from "lucide-react";
import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import LeaveReviewModal from "../../../components/ui/LeaveReviewModal";
import { AuthContext } from "../../../context/AuthContext";
import { fetchReviews, getRecentReviews } from "../../../api/reviews";

const REVIEWS_LIMIT_HOME = 3;

export const ClientReviewsSection = () => {
  const { t } = useTranslation();
  const [allReviews, setAllReviews] = useState([]);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const { requireAuth } = useContext(AuthContext);

  // Fetch reviews from database on mount
  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        const dbReviews = await fetchReviews();
        
        // Add user-submitted reviews from localStorage
        const storedReviews = [];
        try {
          const stored = localStorage.getItem("site_reviews");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              storedReviews.push(...parsed);
            }
          }
        } catch (e) {
          // ignore localStorage errors
        }

        const combined = [...storedReviews, ...dbReviews];
        setAllReviews(combined);
        
        // Show only 3 reviews on home page
        setDisplayedReviews(getRecentReviews(combined, REVIEWS_LIMIT_HOME));
      } catch (error) {
        console.error("Failed to load reviews", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  const handleOpen = () => requireAuth(() => setModalOpen(true));
  const handleClose = () => setModalOpen(false);

  const handleSubmit = async (payload) => {
    try {
      const stored = localStorage.getItem("site_reviews");
      const parsed = stored ? JSON.parse(stored) : [];
      const updated = [payload, ...(Array.isArray(parsed) ? parsed : [])];
      localStorage.setItem("site_reviews", JSON.stringify(updated));
      
      // Update displayed reviews
      const allUpdated = [payload, ...allReviews];
      setAllReviews(allUpdated);
      setDisplayedReviews(getRecentReviews(allUpdated, REVIEWS_LIMIT_HOME));
    } catch (e) {
      console.error("Failed to save review", e);
    }
  };

  return (
    <section id="reviews" className="w-full bg-app-primary py-12 px-6 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-app-text-primary">{t('common.loadingReviews')}</p>
          </div>
        ) : (
          <>
            {/* Reviews Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 mb-12 sm:mb-16 " >
              {displayedReviews.map((review, index) => (
                <Card
                  key={index}
                  className="h-full bg-app-accent border-2 border-app-primary rounded-2xl overflow-hidden"
                >
                  <CardContent className="flex flex-col gap-6 p-6 sm:p-8 h-full">
                    {/* Quote Icon */}
                    <QuoteIcon className="w-6 h-6 text-app-primary flex-shrink-0" />

                    {/* Review Text */}
                    <p className="text-sm sm:text-base text-app-primary leading-relaxed flex-1">
                      {review.review}
                    </p>

                    {/* Reviewer Info */}
                    <div className="border-t border-app-primary/20 pt-4">
                      <p className="text-base sm:text-lg font-semibold text-app-primary">
                        {review.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View More / Leave Review Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              
              <Button 
                onClick={handleOpen} 
                className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-app-secondary rounded-full hover:bg-app-primary/90 h-auto"
              >
                <span className="text-sm sm:text-base font-semibold text-app-text-light">{t('common.leaveYourReview')}</span>
                <ArrowRightIcon className="w-5 h-5 text-app-text-light" />
              </Button>
            </div>
          </>
        )}
      </div>

      <LeaveReviewModal open={modalOpen} onClose={handleClose} onSubmit={handleSubmit} />
    </section>
  );
};