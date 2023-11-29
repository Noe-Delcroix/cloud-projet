export const OwnMessage = ({date, content}) => {
    return (

        <div className={`w-full flex flex-row justify-end`} >

            <div className="bg-blue-500 text-white shadow my-4 px-10 py-2 max-w-[70%] rounded-b-3xl rounded-l-3xl">
                <div className="flex flex-row items-center justify-end mb-2">
                    <p className="font-light text-sm">{new Date(date).toLocaleString()}</p>
                </div>
                <div className="mb-1 text-justify">{content}</div>
            </div>

        </div>


    );
};