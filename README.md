# Personal Portfolio Website

A modern personal portfolio website with CRUD functionality for projects, built with Express.js, MongoDB, and role-based authentication.

## Features

- **Modern UI Design**: Clean, responsive design inspired by modern portfolio websites
- **Project Management**: Full CRUD operations for portfolio projects
- **Dynamic Content Settings**: Edit hero section, skills summary, and profile text from admin panel
- **Role-Based Access**: Admin and visitor roles with different permissions
- **Authentication System**: Secure login system for admin access
- **Image Upload**: Support for project images with preview functionality
- **Category Filtering**: Filter projects by category (Design, Web Development, etc.)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Technology Stack

- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Express-session with bcryptjs
- **File Upload**: Multer for image handling
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with modern design principles

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Step 1: Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### Step 2: Environment Configuration

Copy the environment configuration:
```bash
# Copy the config file
cp config.env .env
```

Edit the `.env` file with your MongoDB connection string:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/portfolio_db
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
NODE_ENV=development
```

### Step 3: Setup Database and Admin User

```bash
# Create admin user (run this once)
node setup-admin.js

# Create default settings (run this once)
node setup-settings.js
```

This will create an admin user with:
- Username: `admin`
- Password: `admin123`

**Important**: Change the password after first login!

### Step 4: Start the Application

```bash
# Development mode with auto-restart
npm run dev

# Or start normally
node index.js
```

### Step 5: Access the Application

- **Portfolio Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## Usage

### For Visitors

1. Visit http://localhost:3000 to view the portfolio
2. Browse projects by category using the filter buttons
3. View project details and technologies used
4. Contact information is available in the contact section

### For Admins

1. Visit http://localhost:3000/admin
2. Login with admin credentials (admin/admin123)
3. **Add Projects**: Click "Add New Project" button
4. **Edit Projects**: Click the edit button on any project
5. **Delete Projects**: Click the delete button and confirm
6. **Upload Images**: Select project images during add/edit
7. **Edit Settings**: Scroll to "Other Settings" section to edit:
   - Hero section text (greeting, name, title, description)
   - Skills summary (primary stack, favorite tools, learning)
   - Each field has its own "Save" button for individual updates

## Project Structure

```
portofolio_v2/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js              # User model
│   ├── Project.js           # Project model
│   └── Settings.js          # Settings model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── projects.js          # Project CRUD routes
│   └── settings.js          # Settings routes
├── public/
│   ├── css/
│   │   ├── style.css        # Main styles
│   │   └── admin.css        # Admin panel styles
│   ├── js/
│   │   ├── main.js          # Main JavaScript
│   │   └── admin.js         # Admin panel JavaScript
│   ├── uploads/             # Project images storage
│   ├── index.html           # Main portfolio page
│   └── admin.html           # Admin panel page
├── config.env               # Environment configuration
├── setup-admin.js          # Admin user creation script
├── setup-settings.js       # Default settings creation script
├── index.js                # Main server file
└── package.json            # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/status` - Check authentication status
- `POST /api/auth/create-admin` - Create admin user (setup only)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/category/:category` - Get projects by category
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Settings
- `GET /api/settings` - Get current settings (public)
- `PUT /api/settings` - Update settings (admin only)

## Security Features

- Password hashing with bcryptjs
- Session-based authentication
- Role-based access control
- File upload validation
- Input sanitization and validation

## Customization

### Adding New Categories
Edit the Project model in `models/Project.js`:
```javascript
category: {
  type: String,
  required: true,
  enum: ['Design', 'Web Development', 'App Development', 'Video Editing', 'Your New Category']
}
```

### Styling
- Main styles: `public/css/style.css`
- Admin styles: `public/css/admin.css`
- Color scheme can be customized in CSS variables

### Adding New Skills
Edit the skills section in `public/index.html` and add corresponding styles in `public/css/style.css`.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env` file

2. **Image Upload Issues**
   - Ensure `public/uploads` directory exists
   - Check file permissions

3. **Admin Login Issues**
   - Run `node setup-admin.js` to create admin user
   - Check username/password: admin/admin123

4. **Port Already in Use**
   - Change PORT in `.env` file
   - Or kill the process using the port

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `SESSION_SECRET`
3. Use MongoDB Atlas for database
4. Set up proper file storage (AWS S3, etc.)
5. Use PM2 or similar for process management
6. Set up reverse proxy (Nginx)

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.
