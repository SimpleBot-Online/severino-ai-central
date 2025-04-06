/**
 * Evolution API Integration Utility
 * 
 * This file contains utility functions for interacting with the Evolution API
 * for WhatsApp automation and webhook handling.
 */

import { toast } from '@/components/ui/use-toast';

interface EvolutionAPIConfig {
  apiKey: string;
  baseUrl: string;
}

interface WebhookConfig {
  url: string;
  events?: string[];
}

interface Instance {
  instanceName: string;
  phoneNumber: string;
  token?: string;
}

// Define a more inclusive type for webhook data response
interface WebhookData {
  event: string;
  instanceName: string;
  phoneNumber?: string;
  message?: string;
  messageType?: string;
  status?: string;
  qrcode?: string;
  error?: string;
}

/**
 * Configures a webhook for a specific instance
 */
export const configureWebhook = async (
  config: EvolutionAPIConfig,
  instance: Instance,
  webhook: WebhookConfig
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${config.baseUrl}/webhook/set/${instance.instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.apiKey
      },
      body: JSON.stringify({
        webhookUrl: webhook.url,
        events: webhook.events || [
          'MESSAGES_UPSERT',
          'MESSAGES_UPDATE',
          'CONNECTION_UPDATE',
          'QRCODE_UPDATED'
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to configure webhook');
    }
    
    return { 
      success: true, 
      message: 'Webhook configurado com sucesso' 
    };
  } catch (error) {
    console.error('Error configuring webhook:', error);
    return { 
      success: false, 
      message: `Erro ao configurar webhook: ${error.message}` 
    };
  }
};

/**
 * Creates a new WhatsApp instance
 */
export const createInstance = async (
  config: EvolutionAPIConfig,
  instance: Instance
): Promise<{ success: boolean; message: string; connectionUrl?: string }> => {
  try {
    const response = await fetch(`${config.baseUrl}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.apiKey
      },
      body: JSON.stringify({
        instanceName: instance.instanceName,
        token: instance.token || instance.phoneNumber,
        qrcode: true
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create instance');
    }
    
    return { 
      success: true, 
      message: 'Instância criada com sucesso',
      connectionUrl: `${config.baseUrl}/instance/connect/${instance.instanceName}`
    };
  } catch (error) {
    console.error('Error creating instance:', error);
    return { 
      success: false, 
      message: `Erro ao criar instância: ${error.message}` 
    };
  }
};

/**
 * Connects to an existing instance
 */
export const connectInstance = async (
  config: EvolutionAPIConfig,
  instanceName: string
): Promise<{ success: boolean; message: string; qrcode?: string }> => {
  try {
    const response = await fetch(`${config.baseUrl}/instance/connect/${instanceName}`, {
      method: 'GET',
      headers: {
        'apikey': config.apiKey
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to connect to instance');
    }
    
    return { 
      success: true, 
      message: 'Conectando à instância',
      qrcode: data.qrcode
    };
  } catch (error) {
    console.error('Error connecting to instance:', error);
    return { 
      success: false, 
      message: `Erro ao conectar à instância: ${error.message}` 
    };
  }
};

/**
 * Sends a message to a specific WhatsApp number
 */
export const sendMessage = async (
  config: EvolutionAPIConfig,
  instanceName: string,
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${config.baseUrl}/message/text/${instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.apiKey
      },
      body: JSON.stringify({
        number: phoneNumber,
        options: {
          delay: 1200
        },
        textMessage: message
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send message');
    }
    
    return { 
      success: true, 
      message: 'Mensagem enviada com sucesso' 
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return { 
      success: false, 
      message: `Erro ao enviar mensagem: ${error.message}` 
    };
  }
};

/**
 * Heat up a chip by sending initial messages
 */
export const heatUpChip = async (
  config: EvolutionAPIConfig,
  phone: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Creates a temporary instance name based on the phone number
    const instanceName = `temp_${phone.replace(/\D/g, '')}`;
    
    // Create the instance
    const createResult = await createInstance(config, {
      instanceName,
      phoneNumber: phone,
    });
    
    if (!createResult.success) {
      return createResult;
    }
    
    // Connect to the instance to generate QR code
    const connectResult = await connectInstance(config, instanceName);
    
    if (!connectResult.success) {
      return connectResult;
    }
    
    return { 
      success: true, 
      message: 'Processo de aquecimento iniciado. Escaneie o QR code no celular com o número indicado.' 
    };
  } catch (error) {
    console.error('Error during heat up process:', error);
    return { 
      success: false, 
      message: `Erro no processo de aquecimento: ${error.message}` 
    };
  }
};

/**
 * Parses webhook data from Evolution API
 */
export const parseWebhookData = (data: any): WebhookData => {
  try {
    // Extract the event type
    const event = data.event || 'unknown';
    const instanceName = data.instance?.instanceName || 'unknown';
    
    // Default result
    const result: WebhookData = {
      event,
      instanceName
    };
    
    // Parse based on event type
    if (event === 'MESSAGES_UPSERT' || event === 'MESSAGES_UPDATE') {
      return {
        ...result,
        phoneNumber: data.data?.key?.remoteJid?.replace(/@.*$/, '') || '',
        message: data.data?.message?.conversation || data.data?.message?.extendedTextMessage?.text || '',
        messageType: Object.keys(data.data?.message || {})[0] || 'unknown'
      };
    } else if (event === 'CONNECTION_UPDATE') {
      return {
        ...result,
        status: data.data?.state || 'unknown'
      };
    } else if (event === 'QRCODE_UPDATED') {
      return {
        ...result,
        qrcode: data.data?.qrcode || ''
      };
    }
    
    return result;
  } catch (error) {
    console.error('Error parsing webhook data:', error);
    return {
      event: 'error',
      instanceName: 'unknown',
      error: error.message
    };
  }
};

/**
 * Utility function to handle webhook events
 */
export const handleWebhookEvent = (data: any): void => {
  const parsedData = parseWebhookData(data);
  
  switch (parsedData.event) {
    case 'CONNECTION_UPDATE':
      if (parsedData.status === 'open') {
        toast({
          title: "Conexão estabelecida",
          description: `Instância ${parsedData.instanceName} conectada com sucesso.`,
        });
      } else if (parsedData.status === 'connecting') {
        toast({
          title: "Conectando...",
          description: `Instância ${parsedData.instanceName} está se conectando.`,
        });
      } else if (parsedData.status === 'close') {
        toast({
          title: "Conexão encerrada",
          description: `Instância ${parsedData.instanceName} desconectada.`,
          variant: "destructive"
        });
      }
      break;
      
    case 'MESSAGES_UPSERT':
      // Only show a notification for incoming messages
      if (parsedData.messageType !== 'unknown') {
        toast({
          title: "Nova mensagem",
          description: `De: ${parsedData.phoneNumber}`,
        });
      }
      break;
      
    case 'QRCODE_UPDATED':
      toast({
        title: "QR Code atualizado",
        description: `Escaneie o QR Code para a instância ${parsedData.instanceName}.`,
      });
      break;
      
    default:
      // Don't show toast for unknown events
      break;
  }
  
  // Log the event for debugging
  console.log(`[Evolution API] ${parsedData.event} event:`, parsedData);
};
