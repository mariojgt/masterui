// Alert.vue

// Define the type for a button in the alert
type AlertButton = {
  text: string;
  type?: string; // Optional button type, e.g., 'btn-primary'
};

// Define props for the Alert component
interface AlertProps {
  type?: string;
  shadow?: boolean;
  iconSize?: string;
  title?: string;
  description?: string;
  buttons?: AlertButton[];
}

// Define the type for the Alert component's setup function
type AlertSetup = {
  props: Readonly<AlertProps>;
};

// Export the types
export { AlertProps, AlertButton, AlertSetup };
