function About() {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="bg-white p-8 rounded-lg border w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">About This Website</h1>
          <p className="text-gray-600">
            Welcome to the airport data analytics platform! We aim to provide you with insightful visualisation to the airport data from <a href="https://ourairports.com/data/">ourairports.com</a> and <a href="https://openflights.org">openflights.org</a>.
          </p>
          <p className="text-gray-600">
            <a href="https://github.com/yzh503/viz-demo">Source Code</a>
          </p>
        </div>
      </div>
    );
  }
  
  export default About;