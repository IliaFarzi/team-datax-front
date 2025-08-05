import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        این بخش هنوز توسعه داده نشده 🚧
      </h1>
      <p className="text-gray-600 mb-6">
        پروژه در حال توسعه است. به زودی این قسمت فعال خواهد شد.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
};

export default NotFound;
