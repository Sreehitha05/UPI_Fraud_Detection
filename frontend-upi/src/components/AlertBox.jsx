function AlertBox({ message }) {

    return (

        <div
            className="

                fixed
                top-5
                right-5

                bg-red-600
                text-white

                px-6
                py-4

                rounded-2xl
                shadow-2xl

                z-50

                animate-bounce
            "
        >

            <h1 className="font-bold text-lg">

                🚨 Fraud Alert

            </h1>

            <p>

                {message}

            </p>

        </div>
    );
}

export default AlertBox;