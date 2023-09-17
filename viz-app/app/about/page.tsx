function About() {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="bg-white p-8 rounded-lg border w-full max-w-md text-gray-600 gap-y-5">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">About This Website</h1>
          <p className="mb-5">
            Welcome to the aviation data analytics platform!
          </p>
          <p className="mb-5">We aim to provide you with insightful visualisation to the aviation data from <a href="https://ourairports.com/data/" className="text-blue-600">ourairports.com</a> and <a href="https://openflights.org" className="text-blue-600">openflights.org</a></p>
          <p className="mb-5">
            <a href="https://github.com/yzh503/viz-demo" className="text-blue-600">Source Code</a> by Simon Yang
          </p>
        </div>
      </div>
    );
  }
  
  export default About;