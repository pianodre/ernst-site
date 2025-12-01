/**
 * Review Functionality
 * Handles review expansion/collapse and review submission modal
 */

document.addEventListener('DOMContentLoaded', function() {
    // Review Expand/Collapse Functionality
    const expandableReviews = document.querySelectorAll('.review-card[data-expandable="true"]');
    
    expandableReviews.forEach(reviewCard => {
        const expandBtn = reviewCard.querySelector('.review-expand-btn');
        const textContainer = reviewCard.querySelector('.review-text-container');
        const expandText = expandBtn.querySelector('.expand-text');
        
        if (expandBtn && textContainer) {
            expandBtn.addEventListener('click', function() {
                const isExpanded = reviewCard.classList.contains('expanded');
                
                if (isExpanded) {
                    // Collapse
                    reviewCard.classList.remove('expanded');
                    textContainer.classList.remove('expanded');
                    textContainer.classList.add('collapsed');
                    expandText.textContent = 'Read more';
                    expandBtn.setAttribute('aria-label', 'Expand review');
                } else {
                    // Expand
                    reviewCard.classList.add('expanded');
                    textContainer.classList.remove('collapsed');
                    textContainer.classList.add('expanded');
                    expandText.textContent = 'Read less';
                    expandBtn.setAttribute('aria-label', 'Collapse review');
                }
            });
        }
    });
    
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
                    console.error('Review submission failed');
                    alert('Sorry, there was an error submitting your review. Please try again.');
                }
            } catch (error) {
                console.error('Review submission error', error);
                alert('Sorry, there was an error submitting your review. Please try again.');
            }
        });
    }
});
