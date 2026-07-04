/**
 * Review Functionality
 * Handles review expansion/collapse and review submission modal
 */

document.addEventListener('DOMContentLoaded', function() {
    // Review Expand/Collapse Functionality
    const expandableReviews = document.querySelectorAll('.review-card[data-expandable="true"]');
    const COLLAPSED_HEIGHT = 120;

    expandableReviews.forEach(reviewCard => {
        const expandBtn = reviewCard.querySelector('.review-expand-btn');
        const textContainer = reviewCard.querySelector('.review-text-container');
        const expandText = expandBtn?.querySelector('.expand-text');

        if (!expandBtn || !textContainer) return;

        expandBtn.addEventListener('click', function() {
            const isExpanded = reviewCard.classList.contains('expanded');

            if (isExpanded) {
                // Collapse — measure current height first so max-height animates
                textContainer.style.maxHeight = textContainer.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    textContainer.style.maxHeight = '';
                    reviewCard.classList.remove('expanded');
                    textContainer.classList.remove('expanded');
                    textContainer.classList.add('collapsed');
                });
                expandText.textContent = 'Read more';
                expandBtn.setAttribute('aria-label', 'Expand review');
            } else {
                // Expand — animate to full measured height
                reviewCard.classList.add('expanded');
                textContainer.classList.remove('collapsed');
                textContainer.classList.add('expanded');
                textContainer.style.maxHeight = textContainer.scrollHeight + 'px';
                expandText.textContent = 'Read less';
                expandBtn.setAttribute('aria-label', 'Collapse review');
            }
        });
    });

    // Hide "Read more" on reviews short enough to fit when collapsed
    const updateOverflowStates = () => {
        expandableReviews.forEach(reviewCard => {
            const textContainer = reviewCard.querySelector('.review-text-container');
            if (!textContainer) return;
            if (reviewCard.classList.contains('expanded')) {
                // Keep the inline max-height in sync if the text reflows
                textContainer.style.maxHeight = textContainer.scrollHeight + 'px';
                return;
            }
            const fits = textContainer.scrollHeight <= COLLAPSED_HEIGHT + 10;
            reviewCard.classList.toggle('no-overflow', fits);
        });
    };

    updateOverflowStates();
    if (document.fonts?.ready) {
        document.fonts.ready.then(updateOverflowStates);
    }
    window.addEventListener('resize', updateOverflowStates);

    // Review Modal Functionality
    const leaveReviewBtn = document.getElementById('leave-review-btn');
    const reviewModal = document.getElementById('review-modal');
    const reviewModalClose = document.getElementById('review-modal-close');
    const reviewForm = document.getElementById('review-form');
    const reviewSuccessModal = document.getElementById('review-success-modal');
    const reviewSuccessModalClose = document.getElementById('review-success-modal-close');

    const showReviewModal = () => {
        if (!reviewModal) return;
        reviewModal.classList.add('active');
        reviewModal.setAttribute('aria-hidden', 'false');
        // Only lock body scroll on desktop to prevent issues on mobile
        if (window.innerWidth > 768) {
            document.body.style.overflow = 'hidden';
        }
    };

    const hideReviewModal = () => {
        if (!reviewModal) return;
        reviewModal.classList.remove('active');
        reviewModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const showReviewSuccessModal = () => {
        if (!reviewSuccessModal) return;
        reviewSuccessModal.classList.add('active');
        reviewSuccessModal.setAttribute('aria-hidden', 'false');
    };

    const hideReviewSuccessModal = () => {
        if (!reviewSuccessModal) return;
        reviewSuccessModal.classList.remove('active');
        reviewSuccessModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Open review modal
    if (leaveReviewBtn) {
        leaveReviewBtn.addEventListener('click', showReviewModal);
    }

    // Close review modal
    if (reviewModalClose) {
        reviewModalClose.addEventListener('click', hideReviewModal);
    }

    // Close review success modal
    if (reviewSuccessModalClose) {
        reviewSuccessModalClose.addEventListener('click', hideReviewSuccessModal);
    }

    // Close modals when clicking outside
    reviewModal?.addEventListener('click', (e) => {
        if (e.target === reviewModal) {
            hideReviewModal();
        }
    });

    reviewSuccessModal?.addEventListener('click', (e) => {
        if (e.target === reviewSuccessModal) {
            hideReviewSuccessModal();
        }
    });

    // Close modals with the Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideReviewModal();
            hideReviewSuccessModal();
        }
    });

    // Handle review form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(reviewForm);
            const reviewerName = formData.get('reviewer-name');
            const studentName = formData.get('student-name');
            const rating = formData.get('rating');
            const reviewText = formData.get('review');

            // Format the message with name information at the top
            let formattedMessage = `Reviewer: ${reviewerName}\n`;
            if (studentName && studentName.trim() !== '') {
                formattedMessage += `Student: ${studentName}\n`;
            }
            formattedMessage += `Rating: ${'⭐'.repeat(parseInt(rating))} (${rating}/5)\n`;
            formattedMessage += `\nReview:\n${reviewText}`;

            // Create new FormData with formatted message
            const submitData = new FormData();
            submitData.append('email', formData.get('email'));
            submitData.append('message', formattedMessage);

            const submitBtn = reviewForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            try {
                const response = await fetch(reviewForm.action, {
                    method: reviewForm.method,
                    headers: {
                        Accept: 'application/json'
                    },
                    body: submitData
                });

                if (response.ok) {
                    reviewForm.reset();
                    hideReviewModal();
                    showReviewSuccessModal();
                } else {
                    alert('Sorry, there was an error submitting your review. Please try again.');
                }
            } catch (error) {
                alert('Sorry, there was an error submitting your review. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});
