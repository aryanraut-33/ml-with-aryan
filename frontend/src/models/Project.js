const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    // ✅ Project title
    title: {
        type: String,
        required: true,
        trim: true,
    },

    // ✅ Short description
    description: {
        type: String,
        required: true,
        trim: true,
    },

    // ✅ Project Type (Fundamental vs Production)
    type: {
        type: String,
        enum: ['Fundamental', 'Production'],
        required: true,
        default: 'Fundamental',
    },

    // ✅ YouTube Video URL (optional)
    videoUrl: {
        type: String,
        trim: true,
        default: '',
    },

    // ✅ Code Blocks (Array of code snippets)
    codeBlocks: [{
        language: {
            type: String,
            required: true,
            default: 'javascript', // plain text, python, etc.
        },
        code: {
            type: String,
            required: true,
        },
        filename: {
            type: String,
            trim: true,
        },
    }],

    // ✅ Dynamic Content Blocks (New Flexible Structure)
    blocks: [{
        id: String,
        type: {
            type: String,
            enum: ['text', 'image', 'video', 'code', 'heading'],
            required: true
        },
        // detailed content for each block
        content: mongoose.Schema.Types.Mixed,
    }],

    // ✅ Thumbnail image (optional)
    thumbnailUrl: {
        type: String,
        trim: true,
        default: '',
    },

    // ✅ Author (Admin creating the project)
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // ✅ Technologies used (e.g., "Next.js", "Python")
    technologies: {
        type: [String],
        default: [],
    },

    // ✅ Live Demo Link (optional)
    demoUrl: {
        type: String,
        trim: true,
        default: '',
    },

    // ✅ GitHub Repo Link (optional)
    repoUrl: {
        type: String,
        trim: true,
        default: '',
    },

    // ✅ Companion Link (optional)
    companionLink: {
        type: String,
        trim: true,
        default: '',
    }

}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

module.exports = Project;
