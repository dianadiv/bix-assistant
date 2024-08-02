import { LoaderPinwheel } from "lucide-react";

export default function Loading() {
  return (
    <div className="m-auto p-10 animate-spin b-red"><LoaderPinwheel size={48} /></div>
  )
}
