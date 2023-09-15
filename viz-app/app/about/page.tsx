function About() {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">About Us</h1>
          <p className="text-gray-600">
            Welcome to the airport data analytics platform! We aim to provide you with insightful visualisation to the airport data from <a href="https://ourairports.com/data/">ourairports.com</a>.
          </p>
        </div>
      </div>
    );
  }
  
  export default About;