// Music Notes Animation
document.addEventListener('DOMContentLoaded', function() {
    // Get the canvas element
    const canvas = document.getElementById('music-notes-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match parent container
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    
    // Call resize on load and window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Music note symbols
    const musicSymbols = [
        '♩', '♪', '♫', '♬', '𝄞', '𝄢', '♭', '♯', '𝄫', '𝄪'
    ];
    
    // Note class
    class MusicNote {
        constructor() {
            this.reset();
        }
        
        reset() {
            // Random position at the bottom of the screen
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 20;
            
            // Random symbol from our array
            this.symbol = musicSymbols[Math.floor(Math.random() * musicSymbols.length)];
            
            // Random size
            this.size = Math.random() * 15 + 15;
            
            // Random speed (slower is more balloon-like)
            this.speed = Math.random() * 1 + 0.5;
            
            // Random horizontal drift
            this.drift = Math.random() * 0.5 - 0.25;
            
            // Random rotation
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() * 0.02) - 0.01;
            
            // Opacity
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        
        update() {
            // Move up
            this.y -= this.speed;
            
            // Add slight horizontal drift
            this.x += this.drift;
            
            // Rotate
            this.rotation += this.rotationSpeed;
            
            // Reset if off screen
            if (this.y < -50) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            
            // Set black color with opacity
            ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
            
            // Translate to position
            ctx.translate(this.x, this.y);
            
            // Rotate
            ctx.rotate(this.rotation);
            
            // Draw the symbol
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.symbol, 0, 0);
            
            ctx.restore();
        }
    }
    
    // Create notes
    const notes = [];
    const noteCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 10000)); // Adjust density based on screen size
    
    for (let i = 0; i < noteCount; i++) {
        const note = new MusicNote();
        // Stagger initial positions
        note.y = Math.random() * canvas.height;
        notes.push(note);
    }
    
    // Animation loop
    function animate() {
        // Clear canvas with transparency to allow background to show through
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw all notes
        notes.forEach(note => {
            note.update();
            note.draw();
        });
        
        // Continue animation
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
});
