
const Footer = () => {
  return (
    <footer>
        <div className="container mx-auto py-12 px-4">  
            <div className="flex flex-wrap justify-center">
                <div className="w-full md:w-6/12 px-4">
                    <h4 className="text-3xl font-semibold">Blog Platform</h4>
                    <h5 className="text-lg mt-0 mb-2 text-gray-700">Thank you for visiting our website!</h5>
                    <div className="mt-6">
                        <a href="https://www.linkedin.com/in/peter-anwar-0bb1a01b3/" target="_blank"  className="text-green-700">
                            Peter Anwar
                        </a>
                        <div className="text-gray-600 ml-1">
                            &copy; {new Date().getFullYear()}
                        </div>

                </div>
                </div>
            </div>
        </div>
        
    </footer>
  )
}

export default Footer