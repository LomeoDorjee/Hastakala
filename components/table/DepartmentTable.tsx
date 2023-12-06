"use client"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Input, Button, useDisclosure, SortDescriptor, Tooltip, Chip } from "@nextui-org/react"
import { Key, useCallback, useMemo, useState } from "react"
import { DeleteIcon, EditIcon, SearchIcon } from "@/components/icons/icons"
import DepartmentForm from "@/components/forms/DepartmentForm"
import { deleteDepartment } from "@/lib/actions/config/department.actions"

type DepProps = {
    departments: {
        depid: number;
        depname: string;
        isactive: boolean;
    }[] | undefined;
}

type Department = {
    depid: number;
    depname: string;
    isactive: boolean
}

export default function DepartmentTable({ departments }: DepProps) {
    
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    
    const [departmentName, setDepartmentName] = useState("")
    const [departmentId, setDepartmentId] = useState(0)
    const [isSelected, setIsSelected] = useState(true);

    // Filtering
        const onSearchChange = useCallback((value: string) => {
            if (value) {
              setFilterValue(value);
              setPage(1);
            } else {
              setFilterValue("");
            }
        }, []);

        const [filterValue, setFilterValue] = useState('');

        const hasSearchFilter = Boolean(filterValue);

        const filteredItems = useMemo(() => {
            let filteredData = departments;
            if (hasSearchFilter) {
                filteredData = filteredData?.filter((filter) =>
                    filter.depname.toLowerCase().includes(filterValue.toLowerCase()),
                );
            }
        
            return filteredData;
        }, [departments, filterValue]);

    // Pagination
        const [page, setPage] = useState(1);
        const rowsPerPage = 9;

        const pages = Math.ceil(((filteredItems?.length) ? filteredItems.length : 1 ) / rowsPerPage);
    
        const items = useMemo(() => {
            const start = (page - 1) * rowsPerPage
            const end = start + rowsPerPage;
            return (filteredItems) ? filteredItems.slice(start, end) : [];
        }, [page, filteredItems]);

        const onNextPage = useCallback(() => {
            if (page < pages) {
            setPage(page + 1);
            }
        }, [page, pages]);
        
        const onPreviousPage = useCallback(() => {
            if (page > 1) {
            setPage(page - 1);
            }
        }, [page]);

    // Sorting
        const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
            column: "age",
            direction: "ascending",
        });

        const sortedData = useMemo(() => {
            return [...items].sort((a: Department, b: Department) => {
                const first = a[sortDescriptor.column as keyof Department] as number;
                const second = b[sortDescriptor.column as keyof Department] as number;
                const cmp = first < second ? -1 : first > second ? 1 : 0;
          
                return sortDescriptor.direction === "descending" ? -cmp : cmp;
              });
        }, [sortDescriptor, items]);

        const handleEdit = (item: Department) => {
            setDepartmentName(item.depname)
            setDepartmentId(item.depid)
            setIsSelected(item.isactive)
            onOpen()
        }
        
        const handleNew = () => {
            setDepartmentName("")
            setDepartmentId(0)
            setIsSelected(true)
            onOpen()
        }

    // Inputs
        const topContent = useMemo(() => {
            return (
                <div className="flex justify-between gap-4 items-center w-full">
                    <Input
                        isClearable
                        placeholder="Search by Staff Name..."
                        startContent={ <SearchIcon /> }
                        value={filterValue}
                        onValueChange={onSearchChange}
                        size="sm"
                    />
                    <Button onPress={() => handleNew()} color="secondary">&#10010; Add</Button>
                </div>
            );
        }, [
            filterValue,
            onSearchChange,
            hasSearchFilter,
            departments?.length,
            hasSearchFilter
        ]);

        const bottomContent = useMemo(() => {
            return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                        
                </span>
                    
                {pages > 0 ? (
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="secondary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    ) : null
                }
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                    Previous
                </Button>
                <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                    Next
                </Button>
                </div>
            </div>
            );
        }, [items.length, page, pages, hasSearchFilter]);
    
        const renderCell = useCallback((item: Department, columnKey: Key) => {
            const cellValue = item[columnKey as keyof Department];
        
            switch (columnKey) {
                case "isactive":
                    return (
                        <Chip color={item.isactive ? "success" : "danger"} variant="bordered"> {item.isactive ? "Active" : "Inactive"}</Chip>
                    )
                case "actions":
                    return (
                        <div className="relative flex items-center gap-5">
                            <Tooltip content="Edit Department" color="secondary">
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(item)}>
                                    <EditIcon />
                                </span>
                                </Tooltip>
                                <Tooltip color="danger" content="Delete Department">
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => { deleteDepartment(item.depid) }}>
                                    <DeleteIcon />
                                </span>
                            </Tooltip>
                      </div>
                    );
                default:
                    return cellValue;
            }
        }, [departments]);

    return (
        <div className="flex flex-col max-w-xl mx-auto my-0">
            <DepartmentForm 
                onOpen={onOpen} 
                isOpen={isOpen} 
                onOpenChange={onOpenChange} 
                departmentName={departmentName} 
                departmentId={departmentId} 
                setDepartmentName={ setDepartmentName } 
                onClose={onClose}
                isSelected={isSelected}
                setIsSelected={setIsSelected}
            />

            <Table 
                color="success"
                isHeaderSticky
                selectionMode="single" 
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                aria-label="User Collection Table"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                topContent={ topContent }
                topContentPlacement="outside"
            >
                <TableHeader>
                    <TableColumn key="depname" align="start" allowsSorting={true}>DEPARTMENT NAME</TableColumn>
                    <TableColumn key="isactive" align="center" allowsSorting={true}>STATUS</TableColumn>
                    <TableColumn key="actions" align="center" allowsSorting={false}>ACTION</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No data found"}
                    items={sortedData}
                >
                    {(item) => (
                        <TableRow key={item.depid}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
