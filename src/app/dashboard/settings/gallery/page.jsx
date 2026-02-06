'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { API_URL } from '../../../../../config/api';
import ImgBBUpload from '../../../../../components/ImgBBUpload';

const GalleryPage = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventDate: '',
        category: 'Events',
        images: [],
        featured: false,
        isActive: true
    });
    const [editingGallery, setEditingGallery] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    // Gallery categories with enhanced styling
    const categories = [
        { value: 'Events', label: 'School Events', icon: '🎉', color: 'bg-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700' },
        { value: 'Sports', label: 'Sports Activities', icon: '⚽', color: 'bg-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700' },
        { value: 'Cultural', label: 'Cultural Programs', icon: '🎭', color: 'bg-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-700' },
        { value: 'Academic', label: 'Academic Events', icon: '🎓', color: 'bg-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-700' },
        { value: 'Infrastructure', label: 'School Infrastructure', icon: '🏗️', color: 'bg-gray-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', textColor: 'text-gray-700' },
        { value: 'Achievements', label: 'Achievement Gallery', icon: '🏆', color: 'bg-yellow-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-700' }
    ];

    useEffect(() => {
        fetchGalleries();
    }, []);

    const fetchGalleries = async () => {
        try {
            const response = await fetch(`${API_URL}/api/gallery`);
            const data = await response.json();
            if (data.success) {
                setGalleries(data.data);
            }
        } catch (error) {
            console.error('Error fetching galleries:', error);
            Swal.fire('Error', 'Failed to fetch galleries', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formDataToSend = new FormData();

            // Add basic form data
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('eventDate', formData.eventDate);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('featured', formData.featured.toString());
            formDataToSend.append('isActive', formData.isActive.toString());

            // Add existing images
            formData.images.forEach((image, index) => {
                formDataToSend.append('existingImages', image);
            });

            // Note: All images are now managed in formData.images, no separate uploadedImgBBUrls

            const url = editingGallery
                ? `${API_URL}/api/gallery/${editingGallery._id}`
                : `${API_URL}/api/gallery`;

            const method = editingGallery ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formDataToSend, // No Content-Type header for FormData
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: editingGallery ? 'Updated!' : 'Created!',
                    text: `Gallery ${editingGallery ? 'updated' : 'created'} successfully`,
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchGalleries();
                resetForm();
                setShowModal(false);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error saving gallery:', error);
            Swal.fire('Error', error.message || 'Failed to save gallery', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (gallery) => {
        setEditingGallery(gallery);
        setFormData({
            title: gallery.title,
            description: gallery.description,
            eventDate: new Date(gallery.eventDate).toISOString().split('T')[0],
            category: gallery.category,
            images: gallery.images || [],
            featured: gallery.featured || false,
            isActive: gallery.isActive
        });
        setCurrentImageUrl('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this! All images will be deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}/api/gallery/${id}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire('Deleted!', 'Gallery has been deleted.', 'success');
                    fetchGalleries();
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error('Error deleting gallery:', error);
                Swal.fire('Error', 'Failed to delete gallery', 'error');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            eventDate: '',
            category: 'Events',
            images: [],
            featured: false,
            isActive: true
        });
        setEditingGallery(null);
        setCurrentImageUrl('');
    };

    const addImage = () => {
        if (currentImageUrl.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, currentImageUrl.trim()]
            }));
            setCurrentImageUrl('');
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const filteredGalleries = galleries.filter(gallery => {
        const matchesSearch = gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            gallery.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || gallery.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
                        <div className="h-12 bg-gray-300 rounded mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                                    <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2">Gallery Management</h1>
                            <p className="text-gray-600">Manage school photo galleries and images</p>
                        </div>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            <span className="text-xl">+</span>
                            Add Gallery
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search galleries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                            />
                        </div>
                        <div className="lg:w-64">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>{category.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Galleries Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredGalleries.map((gallery) => {
                        const category = categories.find(cat => cat.value === gallery.category);
                        return (
                            <div key={gallery._id} className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                                {/* Gallery Images Preview */}
                                <div className="relative mb-4">
                                    {gallery.images && gallery.images.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {gallery.images.slice(0, 4).map((image, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                                                    <img
                                                        src={image}
                                                        alt={`${gallery.title} ${idx + 1}`}
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/200x200?text=Image+Error';
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                            {gallery.images.length > 4 && (
                                                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                    +{gallery.images.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-500 text-4xl">📷</span>
                                        </div>
                                    )}

                                    {/* Featured Badge */}
                                    {gallery.featured && (
                                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                            ⭐ Featured
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{gallery.title}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{gallery.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(gallery)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(gallery._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${category?.bgColor} ${category?.textColor} border ${category?.borderColor}`}>
                                        {category?.icon} {gallery.category}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(gallery.eventDate).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Images:</span>
                                        <span className="text-sm font-bold text-gray-900">{gallery.images?.length || 0}</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${gallery.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {gallery.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredGalleries.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📷</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No galleries found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-3xl font-black text-gray-900">
                                        {editingGallery ? 'Edit Gallery' : 'Add New Gallery'}
                                    </h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-2">Title *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                                placeholder="Gallery title"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-2">Category *</label>
                                            <select
                                                required
                                                value={formData.category}
                                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                            >
                                                {categories.map(category => (
                                                    <option key={category.value} value={category.value}>
                                                        {category.icon} {category.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Event Date *</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.eventDate}
                                            onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Description *</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
                                            placeholder="Describe the gallery event"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Images</label>

                                        {/* Manual URL Input */}
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="url"
                                                value={currentImageUrl}
                                                onChange={(e) => setCurrentImageUrl(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                                                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                                placeholder="Enter image URL"
                                            />
                                            <button
                                                type="button"
                                                onClick={addImage}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                            >
                                                Add URL
                                            </button>
                                        </div>

                                        {/* ImgBB Upload Component */}
                                        <div className="mb-3">
                                            <ImgBBUpload
                                                onUploadSuccess={(urls) => {
                                                    // Add new uploaded URLs to the existing images
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        images: [...prev.images, ...urls]
                                                    }));
                                                }}
                                                onUploadError={(error) => {
                                                    console.error('ImgBB upload error:', error);
                                                    Swal.fire({
                                                        icon: 'error',
                                                        title: 'Upload Failed',
                                                        text: error,
                                                        confirmButtonColor: '#d33'
                                                    });
                                                }}
                                                multiple={true}
                                                maxFiles={10}
                                            />
                                        </div>

                                        {/* Unified Image Display */}
                                        {formData.images.length > 0 && (
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium mb-2">
                                                    Total Images: {formData.images.length}
                                                </p>
                                                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                                    {formData.images.map((image, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={image}
                                                                alt={`Gallery image ${index + 1}`}
                                                                className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/100x100?text=Error';
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                                                title="Remove image"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="featured"
                                                checked={formData.featured}
                                                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="featured" className="text-sm font-bold text-gray-900">Featured Gallery</label>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="isActive"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="isActive" className="text-sm font-bold text-gray-900">Active</label>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors duration-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {submitting ? 'Saving...' : (editingGallery ? 'Update' : 'Create')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryPage;