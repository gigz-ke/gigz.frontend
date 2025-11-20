// src/pages/gigs/EditGigPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { UpdateGigDTO } from "../data/models/Gig";
import { useAuth } from "../hooks/useAuth";
import { useCategory } from "../hooks/useCategory";
import { useGigs } from "../hooks/useGigs";

export const EditGigPage: React.FC = () => {
  const { gigId } = useParams<{ gigId: string }>();
  const { user, loading: authLoading } = useAuth();
  const { categories, fetchCategories } = useCategory();
  const { getGigById, updateGig } = useGigs();
  const navigate = useNavigate();

  const [form, setForm] = useState<UpdateGigDTO>({
    sellerId: "",
    title: "",
    category: "",
    coverImage: "",
    images: [],
    description: "",
    serviceTitle: "",
    shortDescription: "",
    deliveryTime: 1,
    revisionNumber: 0,
    features: [],
    price: 0,
  });

  const [featureInput, setFeatureInput] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // Fetch gig
  useEffect(() => {
    const fetchGig = async () => {
      if (authLoading) return;
      if (!user) { navigate("/login"); return; }
      if (!gigId) { setError("No gig ID provided"); setIsLoading(false); return; }

      try {
        setIsLoading(true);
        const gig = await getGigById(gigId);
        if (!gig) { alert("Gig not found"); navigate("/gigs"); return; }
        if (gig.sellerId !== user._id) { alert("Not authorized"); navigate("/gigs"); return; }

        setForm({
          sellerId: gig.sellerId,
          title: gig.title,
          category: gig.category,
          coverImage: gig.coverImage,
          images: gig.images || [],
          description: gig.description,
          serviceTitle: gig.serviceTitle,
          shortDescription: gig.shortDescription,
          deliveryTime: gig.deliveryTime,
          revisionNumber: gig.revisionNumber,
          features: gig.features || [],
          price: gig.price,
        });
        setCoverPreview(gig.coverImage);
        setImagesPreview(gig.images || []);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch gig details");
        setIsLoading(false);
      }
    };

    fetchGig();
  }, [gigId, user, authLoading, navigate, getGigById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "price" || name === "deliveryTime" || name === "revisionNumber" ? Number(value) : value,
    }));
  };

  const handleFileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await handleFileToBase64(file);
    setForm(prev => ({ ...prev, coverImage: base64 }));
    setCoverPreview(base64);
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newBase64: string[] = [];
    for (let i = 0; i < files.length; i++) newBase64.push(await handleFileToBase64(files[i]));
    setForm(prev => ({ ...prev, images: [...prev.images!, ...newBase64] }));
    setImagesPreview(prev => [...prev, ...newBase64]);
  };

  const removeImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== index) }));
    setImagesPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setForm(prev => ({ ...prev, features: [...(prev.features || []), featureInput.trim()] }));
    setFeatureInput("");
  };

  const handleRemoveFeature = (index: number) => {
    setForm(prev => ({ ...prev, features: prev.features?.filter((_, idx) => idx !== index) || [] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sellerId) { alert("User not logged in"); return; }
    try { await updateGig(gigId!, form); alert("Gig updated successfully!"); navigate("/gigs"); } 
    catch (err) { console.error(err); alert("Failed to update gig."); }
  };

  if (authLoading || isLoading) return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <span className="text-gray-500 text-lg">Loading gig details...</span>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center py-16 px-4">
      <div className="w-full max-w-7xl bg-white p-12 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-green-900 mb-8">Edit Gig</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10">

          {/* Info Section */}
          <div className="flex-1 flex flex-col gap-6">
            <label className="text-gray-500 font-semibold">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} className="border p-4 rounded-lg outline-none focus:ring-2 focus:ring-green-600" required />

            <label className="text-gray-500 font-semibold">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="border p-4 rounded-lg cursor-pointer focus:ring-2 focus:ring-green-600" required>
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>

            <label className="text-gray-500 font-semibold">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleCoverChange} className="cursor-pointer text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:bg-opacity-10 file:text-green-700 hover:file:bg-opacity-20 transition" />
            {coverPreview && <img src={coverPreview} alt="Cover" className="mt-3 w-full h-64 object-cover rounded-lg border shadow" />}

            <label className="text-gray-500 font-semibold">Upload Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="cursor-pointer text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:bg-opacity-10 file:text-green-700 hover:file:bg-opacity-20 transition" />
            {imagesPreview.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2 max-h-80 overflow-auto">
                {imagesPreview.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-32 object-cover rounded-lg border shadow" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition">×</button>
                  </div>
                ))}
              </div>
            )}

            <label className="text-gray-500 font-semibold">Full Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={6} className="border p-4 rounded-lg outline-none focus:ring-2 focus:ring-green-600 resize-none" />
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col gap-6">
            <label className="text-gray-500 font-semibold">Service Title</label>
            <input type="text" name="serviceTitle" value={form.serviceTitle} onChange={handleChange} className="border p-4 rounded-lg outline-none focus:ring-2 focus:ring-green-600" />

            <label className="text-gray-500 font-semibold">Short Description</label>
            <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={3} className="border p-4 rounded-lg outline-none focus:ring-2 focus:ring-green-600 resize-none" />

            <label className="text-gray-500 font-semibold">Delivery Time (days)</label>
            <input type="number" name="deliveryTime" value={form.deliveryTime} onChange={handleChange} min={1} className="border p-4 rounded-lg outline-none focus:ring-2 focus:ring-green-600" />

            <label className="text-gray-500 font-semibold">Revision Number</label>
            <input type="number" name="revisionNumber" value={form.revisionNumber} onChange={handleChange} min={0} className="border p-4 rounded-lg outline-none focus:ring-2 focus:ring-green-600" />

            <label className="text-gray-500 font-semibold">Features</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())} className="flex-1 border p-4 rounded-lg" placeholder="Add feature" />
              <button type="button" onClick={handleAddFeature} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.features?.map((f, idx) => (
                <span key={idx} className="bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center gap-2">
                  {f}
                  <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-red-600 hover:text-red-800 font-bold">×</button>
                </span>
              ))}
            </div>

            <label className="text-gray-500 font-semibold">Price ($)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} min={0} className="border p-4 rounded-lg outline-none focus:ring-2 focus:ring-green-600" />

            <button type="submit" className="mt-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-lg transition active:scale-95">Update Gig</button>
          </div>

        </form>
      </div>
    </div>
  );
};
