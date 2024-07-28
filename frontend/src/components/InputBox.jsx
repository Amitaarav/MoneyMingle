
export function InputBox({ placeholder, label, onChange }) {
    return (
        <div>
            <div className="text-sm font-medium text-left py-2">
            {label}
            </div>
            <input onChange={onChange} placeholder={placeholder} className="w-full border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
        </div>
    )
}