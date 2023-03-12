
 
// eslint-disable-next-line react/prop-types, no-unused-vars
const LoaderSpinners = ({children}:any) => {
  return (
      <div className='lc-loader-spinner'>
          <div className="lds-default"><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /></div>
          <p>{children}</p>
      </div>
  )
}

export default LoaderSpinners;