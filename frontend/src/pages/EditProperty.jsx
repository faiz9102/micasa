import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import PageHeader from '../components/PageHeader.jsx';
import InputField from '../components/InputField.jsx';
import SelectField from '../components/SelectField.jsx';
import TextAreaField from '../components/TextAreaField.jsx';
import InlineAlert from '../components/InlineAlert.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getProperty, updateProperty } from '../services/propertyService.js';

const parseList = (value) =>
  value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const formatApiError = (err, fallback) => {
  const apiErrors = err?.response?.data?.errors;
  if (Array.isArray(apiErrors) && apiErrors.length) {
    return apiErrors.map((issue) => `${issue.field}: ${issue.message}`).join(' • ');
  }

  return err?.response?.data?.message || fallback;
};

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProperty(id);
        const property = data.property;
        setForm({
          propertyType: property.propertyType,
          purpose: property.purpose,
          city: property.city,
          area: property.area,
          price: property.price,
          description: property.description,
          imageUrls: (property.imageUrls || []).join('\n'),
          amenities: (property.amenities || []).join('\n'),
          bedrooms: property.bedrooms ?? '',
          furnishingStatus: property.furnishingStatus ?? '',
          rentalScope: property.rentalScope ?? '',
          floorNumber: property.floorNumber ?? '',
        });
      } catch (err) {
        setError('Unable to load property.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const isPlot = form.propertyType === 'plot';
    const isRent = form.purpose === 'rent';
    const isFlat = form.propertyType === 'flat';
    const isHouse = form.propertyType === 'house';
    const allowFloorNumber = isFlat || (isRent && isHouse && form.rentalScope === 'single_floor');

    const payload = {
      propertyType: form.propertyType,
      purpose: form.purpose,
      city: form.city,
      area: Number(form.area),
      price: Number(form.price),
      description: form.description,
      imageUrls: parseList(form.imageUrls),
      amenities: form.amenities ? parseList(form.amenities) : undefined,
      bedrooms: isPlot ? undefined : form.bedrooms ? Number(form.bedrooms) : undefined,
      furnishingStatus: isPlot ? undefined : form.furnishingStatus || undefined,
      rentalScope: !isPlot && isRent ? form.rentalScope || undefined : undefined,
      floorNumber: allowFloorNumber && form.floorNumber ? Number(form.floorNumber) : undefined,
    };

    try {
      await updateProperty(id, payload);
      setSuccess('Property updated successfully.');
      setTimeout(() => navigate('/dashboard/user'), 900);
    } catch (err) {
      setError(formatApiError(err, 'Unable to update property.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div>
        <LoadingSpinner label="Loading listing" />
      </div>
    );
  }

  const isPlot = form.propertyType === 'plot';
  const isRent = form.purpose === 'rent';
  const isFlat = form.propertyType === 'flat';
  const isHouse = form.propertyType === 'house';
  const showFloorNumber = isFlat || (isRent && isHouse && form.rentalScope === 'single_floor');

  return (
    <div className="space-y-10 px-6 py-10 md:px-0 md:py-16">
      <PageHeader title="Edit listing" subtitle="Refine the details for your property." />

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-4xl border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Property Type" name="propertyType" value={form.propertyType} onChange={handleChange}>
            <option value="flat">Flat</option>
            <option value="house">House</option>
            <option value="plot">Plot</option>
          </SelectField>
          <SelectField label="Purpose" name="purpose" value={form.purpose} onChange={handleChange}>
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </SelectField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="City" name="city" value={form.city} onChange={handleChange} required />
          <InputField
            label="Area (sq ft)"
            name="area"
            type="number"
            value={form.area}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
          {!isPlot ? (
            <InputField
              label="Bedrooms"
              name="bedrooms"
              type="number"
              value={form.bedrooms}
              onChange={handleChange}
              required={!isPlot}
            />
          ) : null}
        </div>
        {!isPlot ? (
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Furnishing Status"
              name="furnishingStatus"
              value={form.furnishingStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="furnished">Furnished</option>
              <option value="semi_furnished">Semi Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </SelectField>
            {isRent ? (
              <SelectField
                label="Rental Scope"
                name="rentalScope"
                value={form.rentalScope}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="single_floor">Single Floor</option>
                <option value="full_house">Full House</option>
              </SelectField>
            ) : null}
            {showFloorNumber ? (
              <InputField
                label="Floor Number"
                name="floorNumber"
                type="number"
                value={form.floorNumber}
                onChange={handleChange}
                required
                hint={isFlat ? 'Required for flats.' : 'Required for single-floor rentals.'}
              />
            ) : null}
          </div>
        ) : null}
        <TextAreaField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <TextAreaField
          label="Image URLs"
          name="imageUrls"
          value={form.imageUrls}
          onChange={handleChange}
          hint="Add one URL per line or separate with commas."
          required
        />
        <TextAreaField
          label="Amenities"
          name="amenities"
          value={form.amenities}
          onChange={handleChange}
          hint="Optional. One per line or comma separated."
        />
        {error ? <InlineAlert variant="error" message={error} /> : null}
        {success ? <InlineAlert variant="success" message={success} /> : null}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-(--mc-primary) px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-(--mc-primary-strong) disabled:opacity-70"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProperty;
