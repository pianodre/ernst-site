# Dylan's Cybersecurity Portfolio

A modern, responsive portfolio website showcasing my cybersecurity projects, experiences, and skills. Built with HTML, CSS, and JavaScript featuring a cyberpunk aesthetic with animated elements.

## 🚀 Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Cyberpunk Theme**: Dark theme with teal accents and glowing effects
- **Interactive Elements**: 
  - Animated typing effects
  - Matrix background animation
  - Music notes animation
  - Hamburger menu for mobile navigation
  - Expandable experience cards on mobile
- **Modern UI/UX**: Glassmorphism effects, smooth transitions, and hover animations
- **Accessibility**: Proper semantic HTML and ARIA labels

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Icons**: Font Awesome 6.4.0
- **Animations**: CSS animations and transitions
- **Responsive**: CSS Grid and Flexbox

## 📁 Project Structure

```
website/
├── index.html              # Main HTML file
├── recital.html            # Additional page
├── README.md               # This file
├── css/                    # Stylesheets
│   ├── base.css           # Base styles and layout
│   ├── homepage.css       # Homepage specific styles
│   ├── about.css          # About section styles
│   ├── projects.css       # Projects section styles
│   ├── experiences.css    # Experiences section styles
│   └── contact.css        # Contact section styles
├── js/                     # JavaScript files
│   ├── typing-animation.js      # Typing effect animation
│   ├── music-notes-animation.js # Music notes background
│   ├── experience-expand.js     # Mobile experience cards
│   └── hamburger-menu.js        # Mobile navigation
└── content/               # Images and assets
    ├── name-white.png     # Logo/name image
    └── me.png            # Profile image
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional but recommended)

### Installation & Running

#### Option 1: Simple File Opening
```bash
# Clone the repository
git clone https://github.com/pianodre/ernst-site.git
cd ernst-site

# Open directly in browser
open index.html
# or
double-click index.html
```

#### Option 2: Using Python HTTP Server (Recommended)
```bash
# Navigate to project directory
cd /path/to/website

# Python 3
python -m http.server 8000

# Python 2 (if needed)
python -m SimpleHTTPServer 8000

# Open browser and navigate to:
# http://localhost:8000
```

#### Option 3: Using Node.js HTTP Server
```bash
# Install http-server globally
npm install -g http-server

# Navigate to project directory
cd /path/to/website

# Start server
http-server -p 8000

# Open browser and navigate to:
# http://localhost:8000
```

#### Option 4: Using Live Server (VS Code Extension)
```bash
# Install Live Server extension in VS Code
# Right-click on index.html
# Select "Open with Live Server"
```

#### Option 5: Using PHP Built-in Server
```bash
# Navigate to project directory
cd /path/to/website

# Start PHP server
php -S localhost:8000

# Open browser and navigate to:
# http://localhost:8000
```

## 📱 Responsive Breakpoints

- **Desktop**: > 768px (Sidebar navigation)
- **Mobile**: ≤ 768px (Hamburger menu navigation)

## 🎨 Customization

### Colors
The main color scheme uses:
- **Primary**: `#64ffda` (Teal)
- **Background**: `#0a0a0a` (Dark)
- **Secondary**: `#1a1a1a` (Dark Gray)
- **Text**: `#ffffff` (White)

### Fonts
- Primary font stack includes system fonts for optimal performance
- Font Awesome for icons

## 📧 Contact Information

- **Email**: dylanernstr@gmail.com
- **Phone**: (949) 933-3607
- **GitHub**: [pianodre](https://github.com/pianodre)
- **LinkedIn**: [Profile Link]

## 🔧 Development

### Making Changes
1. Edit HTML structure in `index.html`
2. Modify styles in respective CSS files
3. Update JavaScript functionality in `js/` directory
4. Test across different screen sizes and browsers

### Adding New Projects
1. Locate the projects section in `index.html`
2. Replace empty project cards or add new ones following the existing structure
3. Update project details, technologies, and GitHub links

## 🌟 Features Breakdown

### Animations
- **Typing Animation**: Simulates typing effect for hero text
- **Matrix Background**: Falling characters animation
- **Music Notes**: Floating musical notes animation
- **Hover Effects**: Interactive hover states throughout

### Mobile Optimizations
- Hamburger menu navigation
- Collapsible experience cards
- Optimized touch targets
- Responsive images and layouts

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

---

**Built with ❤️ by Dylan Ernst**
