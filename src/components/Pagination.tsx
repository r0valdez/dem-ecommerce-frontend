import styled from 'styled-components'

interface PaginationProps {
  currentPage: number,
  countPerPage: number,
  onNext: Function,
  onPrev: Function,
  onSelectPageCount: Function
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  gap: 1rem;
  width: rem(80px);
`

const Button = styled.div`
  border: 1px solid;
  padding: 0.5rem 1rem;
  cursor: pointer
`

const PageNumber = styled.div`
  border: 1px solid;
  padding: 0.5rem 1rem;
  cursor: pointer
`

const Select = styled.select`
  background-color: #242424;
  color: rgba(255, 255, 255, 0.87);
  border: 1px solid;
  padding: 0 1rem;
`

function Pagination(props: PaginationProps) {
  const { currentPage, countPerPage, onNext, onPrev, onSelectPageCount } = props

  return (
    <Wrapper>
      <Select value={countPerPage} onChange={(e) => onSelectPageCount(e.target.value)}>
        <option>2</option>
        <option>5</option>
        <option>25</option>
        <option>100</option>
      </Select>
      <Button onClick={() => onPrev()}>Prev</Button>
      <PageNumber>{currentPage}</PageNumber>
      <Button onClick={() => onNext()}>Next</Button>
    </Wrapper>
  )
}

export default Pagination