export const Message = ({ userId, date, content}) => {
    return (

        <div className={`w-full flex flex-row justify-start`} >

            <div className="bg-white shadow my-4 px-10 py-2 max-w-[66%] rounded">
                <div className="flex flex-row items-center justify-between mb-2">
                    <span className="font-bold mr-10">{userId}</span>
                    <span className="font-light text-sm">{new Date(date).toLocaleString()}</span>
                </div>
                <div className="text-justify">{content}</div>
            </div>

        </div>


    );
};