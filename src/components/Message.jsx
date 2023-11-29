export const Message = ({ userId, date, content }) => {
    const isBot = userId.includes('[bot]');

    return (
        <div className="w-full flex flex-row justify-start">
            <div className={`${isBot ? 'bg-[#ffbfbf]' : 'bg-white'} shadow my-4 px-10 py-2 max-w-[70%] rounded-t-3xl rounded-r-3xl`}>
                <div className="flex flex-row items-center justify-between mb-2">
                    <span className="font-bold mr-10 md:block hidden">{userId}</span>
                    <span className="font-light text-sm whitespace-nowrap">{new Date(date).toLocaleString()}</span>
                </div>
                <div className="text-justify">{content}</div>
            </div>
        </div>
    );
};
