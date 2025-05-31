// utils/cloudinaryHelper.js
import { cloudinaryConfig } from '../App';

/**
 * Upload PDF file to Cloudinary
 * @param {File} file - The PDF file to upload
 * @param {string} department - Department name for folder organization
 * @returns {Promise<Object>} Upload result with URL and metadata
 */


export const uploadPDFToCloudinary = async (file, department) => {
  try {
    const formData = new FormData();

    // Add file
    formData.append('file', file);

    // Unsigned preset
    formData.append('upload_preset', 'pdf_reports_unsigned');

    // Clean folder name
    const cleanDepartment = department.toLowerCase().replace(/\s+/g, '_');
    const folderPath = `reports/sanitation/${cleanDepartment}`;

    // Clean public ID with timestamp
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, '_');
    const publicIdName = `${folderPath}/${cleanFileName}_${timestamp}`;

    formData.append('public_id', publicIdName);
    formData.append('context', `department=${department}|uploaded_by=user`);

    console.log('Uploading to Cloudinary with:', {
      fileName: file.name,
      fileSize: file.size,
      department,
      folderPath,
      publicId: publicIdName,
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/raw/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Cloudinary error response:', result);
      throw new Error(`Upload failed: ${result.error?.message || response.statusText}`);
    }

    console.log('Cloudinary upload success:', result);

    const viewUrl = result.secure_url;

    return {
      success: true,
      url: result.secure_url,
      viewUrl,
      publicId: result.public_id,
      resourceType: 'raw',
      format: result.format,
      bytes: result.bytes,
      createdAt: result.created_at,
      folder: folderPath,
      originalFilename: file.name,
      displayName: file.name, // local fallback, not from Cloudinary
      version: result.version,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
  }
};

/**
 * Generate view URL from Cloudinary upload result (use only if needed).
 * @param {string} secureUrl - The secure URL returned from Cloudinary
 * @returns {string} Viewable URL (PDF-friendly)
 */
export const generateCloudinaryViewUrl = (secureUrl) => {
  return secureUrl || null;
};


/**
 * Generate Cloudinary URL with transformations (for images)
 * @param {string} publicId - The public ID of the file
 * @param {Object} options - Transformation options
 * @returns {string} Transformed URL
 */
export const generateCloudinaryUrl = (publicId, options = {}) => {
  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}`;
  const transformations = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);

  const transformString = transformations.length > 0 ? `/${transformations.join(',')}` : '';
  const resourceType = options.resourceType || 'raw';

  return `${baseUrl}/${resourceType}/upload${transformString}/${publicId}`;
};

/**
 * Get file info from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {Object|null} Extracted file information
 */
export const parseCloudinaryUrl = (url) => {
  if (!url) return null;

  try {
    const urlParts = url.split('/');
    const publicIdWithFormat = urlParts[urlParts.length - 1];
    const publicId = publicIdWithFormat.includes('.') ? publicIdWithFormat.split('.')[0] : publicIdWithFormat;

    const uploadIndex = urlParts.indexOf('upload');
    const folderParts = urlParts.slice(uploadIndex + 1, -1);
    const folder = folderParts.join('/');

    return {
      publicId,
      folder,
      fullPublicId: folder ? `${folder}/${publicId}` : publicId,
      filename: urlParts[urlParts.length - 1],
    };
  } catch (error) {
    console.error('Error parsing Cloudinary URL:', error);
    return null;
  }
};

/**
 * Generate download URL with proper headers
 * @param {string} publicId - The public ID of the file
 * @param {string} filename - Original filename for download
 * @param {string} folder - The folder path where the file is stored
 * @returns {string} Download URL
 */
export const generateDownloadUrl = (publicId, filename, folder) => {
  if (!publicId) return null;

  const encodedFilename = encodeURIComponent(filename);
  const fullPath = folder ? `${folder}/${publicId}` : publicId;

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/raw/upload/fl_attachment:${encodedFilename}/${fullPath}`;
};
