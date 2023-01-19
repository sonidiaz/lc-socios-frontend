type Props = {
  data: []
}

const Terms = ({data}: Props) => {
  return <>
  {
    data.map((term:any) => {
      return <span key={term.id}>{term.name}</span>
    })
  }
  </>
}

export default Terms