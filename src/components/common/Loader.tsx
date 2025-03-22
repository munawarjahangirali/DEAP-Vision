export const Loader = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="relative inline-flex">
                <div className="w-6 h-6 bg-[#003C34] rounded-full"></div>
                <div className="w-6 h-6 bg-[#003C34] rounded-full absolute top-0 left-0 animate-ping"></div>
                <div className="w-6 h-6 bg-[#003C34] rounded-full absolute top-0 left-0 animate-pulse"></div>
            </div>
        </div>

    )
}