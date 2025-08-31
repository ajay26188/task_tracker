import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import AlertMessage from "../AlertMessage";

type FormLayoutProps = {
    title: string;
    fields: ReactNode;
    actions: ReactNode;
    onSubmit?: (e: React.FormEvent) => void;
  };
  
  const FormLayout = ({ title, fields, actions, onSubmit }: FormLayoutProps) => {
    const alertMessage = useSelector((state: RootState) => state.alertMessage);
  
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <form
          onSubmit={onSubmit}
          className="w-96 bg-white p-10 rounded-3xl shadow-2xl space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            {title}
          </h1>
  
          {fields}
  
          {alertMessage.message && <AlertMessage {...alertMessage} />}
  
          {actions}
        </form>
      </div>
    );
  };
  
  
  export default FormLayout;
  