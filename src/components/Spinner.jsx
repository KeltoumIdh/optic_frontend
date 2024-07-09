import { Loader } from "lucide-react";

export default function Spinner() {
    return <div className="[&>*]:animate-spin w-full min-h-[200px] flex items-center justify-center"><Loader /></div>
}