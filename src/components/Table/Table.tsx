import styled from 'styled-components'
import Pagination from '../Pagination'
import { Product } from '../../App.tsx'

interface Column {
  key: string,
  width: string
}

interface TableProps {
  columns: Column[],
  data: Product[],
  selectable: boolean,
  filter: boolean,
  filterValue: string,
  pagination: boolean,
  currentPage: number,
  countPerPage: number,
  onPrev: Function,
  onNext: Function,
  onSelectPageCount: Function,
  onFilterChange: Function,
  onSubmit: Function,
  onSort: Function,
  onSelectRow: Function,
  loading: boolean,
}

const Wrapper = styled.div`
  width: 100%;
  overflow: auto;
`

const Input = styled.input`
  padding: 0.5rem;
  background-color: #242424;
  color: rgba(255, 255, 255, 0.87);
  border: 1px solid rgba(255, 255, 255, 0.87);
  margin-bottom: 1rem;
  outline: none;
`

const TableHeader = styled.div`
  display: flex;
  width: 100%;
  border: 1px solid;
  box-sizing: border-box;
  text-transform: capitalize;
  cursor: default;
`

const TableBody = styled.div`
  width: 100%;
  border: 1px solid;
  box-sizing: border-box;
`

const TableFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;
  box-sizing: border-box;
`

const TableRow = styled.div`
  display: flex;
  border-bottom: 1px solid;
`

const TableCell = styled.div`
  flex: 1 0 auto;
  padding: 1rem 0;
  box-sizing: border-box;
`

const Checkbox = styled.input`
  font-size: 1.5rem;
`

const ActionButton = styled.button`
  font-size: 0.75rem;
  padding: 0.5rem;
`

function Table(props: TableProps) {
  const { columns, data = [], pagination = true, selectable, filter, filterValue, currentPage = 1, countPerPage = 10, onNext, onPrev, onSelectPageCount, onFilterChange, onSubmit, onSort, onSelectRow, loading = false } = props

  return (
    <Wrapper>
      {filter && (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
          <Input value={filterValue} onChange={(e) => onFilterChange(e.target.value)} />
        </form>
      )}
      <TableHeader>
        {selectable && <TableCell></TableCell>}
        {columns.map((column) => {
          return <TableCell key={column.key} style={{ width: column.width }} onClick={() => onSort(column.key)}>{column.key === '_id' ? 'No' : column.key}</TableCell>
        })}
      </TableHeader>
      <TableBody>
        {loading ? <div style={{ padding: '1rem 0' }}>Loading ... </div> : 
          data.length != 0 ? (
            <>
              {data.map((row, index) => (
                <TableRow key={row._id}>
                  {selectable && <TableCell><Checkbox type="checkbox" onChange={(e) => e.target.checked ? onSelectRow(row) : onSelectRow(null)} /></TableCell>}
                  {columns.map(({ key, width }) => (
                    <TableCell key={key} style={{ width }}>{renderTableCell(row, key, (currentPage - 1) * countPerPage + index + 1)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ) : (<div style={{ padding: '1rem 0' }}>No Result.</div>)
        }
      </TableBody>
      
      {pagination && (
        <TableFooter>
          <Pagination currentPage={currentPage} countPerPage={countPerPage} onNext={onNext}  onPrev={onPrev} onSelectPageCount={onSelectPageCount}/>
        </TableFooter>
      )}
    </Wrapper>
  )
}

const renderTableCell = (row: Product, key: string, index: number) => {
  if (key === '_id') return index
  if (key === 'actions') {
    return (
      <>
        <ActionButton>Checkout</ActionButton>
        <ActionButton>Edit</ActionButton>
        <ActionButton>Delete</ActionButton>
      </>
    )
  }
  
  return row[key]
}

export default Table