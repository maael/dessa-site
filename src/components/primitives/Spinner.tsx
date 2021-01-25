export default function Spinner() {
  return (
    <div className="h-40 w-40 m-5 relative">
      <div className="animate-spin w-full h-full t-0 l-0 absolute slow-4">
        <div className="circle-container">
          <div className="circle">
            <div className="arc border-blue-800 arc-w-05"></div>
          </div>
        </div>
      </div>
      <div className="animate-spin w-full h-full t-0 l-0 absolute reverse slow-5">
        <div className="circle-container">
          <div className="rotation-135 circle circle-40">
            <div className="arc arc-140 border-blue-900 border-2"></div>
          </div>
        </div>
      </div>
      <div className="animate-spin w-full h-full t-0 l-0 absolute slow-3">
        <div className="circle-container">
          <div className="rotation-270 circle circle-20">
            <div className="arc arc-140 border-blue-400 arc-w-05"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
