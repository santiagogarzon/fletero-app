import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

export class StorageService {
  // Upload profile picture
  static async uploadProfilePicture(userId: string, file: File | Blob): Promise<string> {
    try {
      const storageRef = ref(storage, `profile-pictures/${userId}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error: any) {
      console.error('Upload profile picture error:', error);
      throw new Error('Error uploading profile picture');
    }
  }

  // Upload driver documents
  static async uploadDriverDocument(
    userId: string, 
    documentType: 'license' | 'insurance' | 'vehicleRegistration', 
    file: File | Blob
  ): Promise<string> {
    try {
      const storageRef = ref(storage, `driver-documents/${userId}/${documentType}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error: any) {
      console.error('Upload driver document error:', error);
      throw new Error('Error uploading document');
    }
  }

  // Upload freight request images
  static async uploadFreightRequestImage(
    requestId: string, 
    imageIndex: number, 
    file: File | Blob
  ): Promise<string> {
    try {
      const storageRef = ref(storage, `freight-requests/${requestId}/images/${imageIndex}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error: any) {
      console.error('Upload freight request image error:', error);
      throw new Error('Error uploading image');
    }
  }

  // Delete file from storage
  static async deleteFile(filePath: string): Promise<void> {
    try {
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    } catch (error: any) {
      console.error('Delete file error:', error);
      throw new Error('Error deleting file');
    }
  }

  // Get file download URL
  static async getFileDownloadURL(filePath: string): Promise<string> {
    try {
      const storageRef = ref(storage, filePath);
      return await getDownloadURL(storageRef);
    } catch (error: any) {
      console.error('Get download URL error:', error);
      throw new Error('Error getting file URL');
    }
  }
} 