import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  // Request notification permissions
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Get Expo push token for push notifications
  static async getExpoPushToken(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      // Get the token that uniquely identifies this device
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: '1e00c82f-a08c-4f8d-a395-7aa2554491de', // Your Expo project ID
      });

      console.log('Expo Push Token:', token);
      return token.data;
    } catch (error) {
      console.error('Error getting Expo push token:', error);
      return null;
    }
  }

  // Schedule local notification
  static async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: trigger || null,
      });
      
      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  // Cancel notification
  static async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Error canceling notification:', error);
      throw error;
    }
  }

  // Cancel all notifications
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
      throw error;
    }
  }

  // Get badge count
  static async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  }

  // Set badge count
  static async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
      throw error;
    }
  }

  // Listen for notification received
  static addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Listen for notification response (when user taps notification)
  static addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Send notification to specific user
  static async sendNotificationToUser(
    userId: string,
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    try {
      // This would typically be done through your backend
      // For now, we'll just schedule a local notification
      await this.scheduleLocalNotification(title, body, data);
    } catch (error) {
      console.error('Error sending notification to user:', error);
      throw error;
    }
  }

  // Send notification for new freight request
  static async notifyNewFreightRequest(requestId: string, origin: string, destination: string): Promise<void> {
    await this.scheduleLocalNotification(
      'Nuevo Flete Disponible',
      `Flete de ${origin} a ${destination}`,
      { type: 'new_request', requestId }
    );
  }

  // Send notification for new offer
  static async notifyNewOffer(offerId: string, price: number): Promise<void> {
    await this.scheduleLocalNotification(
      'Nueva Oferta Recibida',
      `Oferta de $${price} para tu flete`,
      { type: 'new_offer', offerId }
    );
  }

  // Send notification for job status update
  static async notifyJobStatusUpdate(jobId: string, status: string): Promise<void> {
    const statusMessages = {
      'assigned': 'Tu flete ha sido asignado',
      'in_progress': 'El fletero está en camino',
      'completed': 'Tu flete ha sido completado',
    };

    await this.scheduleLocalNotification(
      'Actualización de Flete',
      statusMessages[status as keyof typeof statusMessages] || 'Estado actualizado',
      { type: 'job_update', jobId, status }
    );
  }
} 