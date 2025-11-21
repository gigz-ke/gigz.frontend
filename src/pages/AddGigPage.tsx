// src/pages/gigs/AddGigPage.tsx
import React, { useState, useEffect } from "react";
import type { CreateGigDTO } from "../data/models/Gig";
import { useAuth } from "../hooks/useAuth";
import { useCategory } from "../hooks/useCategory";
import { useGigs } from "../hooks/useGigs";
import { useNavigate } from "react-router-dom";

export const AddGigPage: React.FC = () => {
  const { createGig } = useGigs();
  const { categories, fetchCategories } = useCategory();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateGigDTO>({
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

  const [featureInput, setFeatureInput] = useState<string>("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { if (!loading && !user) navigate("/login"); }, [loading, user, navigate]);
  useEffect(() => {
    if (user) {
      const email = user.email;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (email) setForm(prev => ({ ...prev, sellerId: email }));
      else console.error("User email missing:", user);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "price" || name === "deliveryTime" || name === "revisionNumber"
        ? Number(value)
        : value,
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
    if (file) {
      const base64 = await handleFileToBase64(file);
      setForm(prev => ({ ...prev, coverImage: base64 }));
      setCoverPreview(base64);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sellerId) return alert("You must be logged in to create a gig.");
    try {
      await createGig(form);
      alert("Gig created successfully!");
      navigate("/gigs");
    } catch (error) {
      console.error("Error creating gig:", error);
      alert("Failed to create gig. See console for details.");
    }
  };

  if (loading || !user) return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <span className="text-gray-500 text-lg">Loading...</span>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center py-16 px-4">
      <div className="w-full max-w-7xl bg-white p-12 rounded-2xl shadow-lg">
        <h1 className="text-gray-500 font-light text-3xl mb-10 text-center">Add New Gig</h1>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10">

          {/* Info Section */}
          <div className="flex-1 flex flex-col gap-6">
            <label className="text-gray-500 font-semibold">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. I will do something I'm really good at" className="border p-4 rounded-lg outline-none focus:ring-2 focus:ring-green-600" required />

            <label className="text-gray-500 font-semibold">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="border p-4 rounded-lg cursor-pointer focus:ring-2 focus:ring-green-600" required>
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>

            <label className="text-gray-500 font-semibold">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleCoverChange} className="cursor-pointer text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:bg-opacity-10 file:text-green-700 hover:file:bg-opacity-20 transition" />
            {coverPreview && <img src={coverPreview} alt="Cover Preview" className="mt-3 w-full h-64 object-cover rounded-lg border shadow" />}

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

            <label className="text-gray-500 font-semibold">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={6} placeholder="Brief descriptions to introduce your service" className="border p-4 rounded-lg outline-none focus:ring-2 focus:ring-green-600 resize-none" required />
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col gap-6">
            <label className="text-gray-500 font-semibold">Service Title</label>
            <input type="text" name="serviceTitle" value={form.serviceTitle} onChange={handleChange} placeholder="e.g. One-page web design" className="border p-4 rounded-lg outline-none focus:ring-2 focus:ring-green-600" required />

            <label className="text-gray-500 font-semibold">Short Description</label>
            <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={3} placeholder="Short description of your service" className="border p-4 rounded-lg outline-none focus:ring-2 focus:ring-green-600 resize-none" required />

            <label className="text-gray-500 font-semibold">Delivery Time (days)</label>
            <input type="number" name="deliveryTime" value={form.deliveryTime} onChange={handleChange} placeholder="Delivery in days" min={1} className="border p-4 rounded-lg outline-none focus:ring-2 focus:ring-green-600" required />

            <label className="text-gray-500 font-semibold">Revision Number</label>
            <input type="number" name="revisionNumber" value={form.revisionNumber} onChange={handleChange} placeholder="Revisions allowed" min={0} className="border p-4 rounded-lg outline-none focus:ring-2 focus:ring-green-600" />

            <label className="text-gray-500 font-semibold">Add Features</label>
            <div className="flex gap-2">
              <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)} className="flex-1 border p-4 rounded-lg outline-none" placeholder="e.g. page design" />
              <button type="button" onClick={handleAddFeature} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.features?.map((f, idx) => (<span key={idx} className="bg-gray-200 px-2 py-1 rounded-lg text-sm">{f}</span>))}
            </div>

            <label className="text-gray-500 font-semibold">Price ($)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Set price" min={0} className="border p-4 rounded-lg outline-none focus:ring-2 focus:ring-green-600" />

            <button type="submit" className="mt-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-lg transition active:scale-95">Create</button>
          </div>

        </form>
      </div>
    </div>
  );
};
