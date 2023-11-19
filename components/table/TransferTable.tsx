"use client"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Input, Button, useDisclosure, SortDescriptor, Tooltip, Chip } from "@nextui-org/react"
import { Key, useCallback, useMemo, useState } from "react"
import { DeleteIcon, EditIcon, SearchIcon } from "@/components/icons/icons"
import DepartmentForm from "@/components/forms/DepartmentForm"
import { deleteDepartment } from "@/lib/actions/config/department.actions"
import Link from "next/link"

type Transfer = {
    transfermasterid: number
    productid: number
    productname: string
    startbyuser: string
    startbyuserid: string
    startdate: string
    status: string
}
type TransferProps = {
    transfers: Transfer[] | undefined
}


export default function TransferTable({ transfers }: TransferProps) {

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
        let filteredData = transfers;
        if (hasSearchFilter) {
            filteredData = filteredData?.filter((filter) =>
                filter.productname.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }

        return filteredData;
    }, [transfers, filterValue]);

    // Fetch Data
    // const [filterDate, setFilterDate] = useState(today);

    // const onDateChange = useCallback((e) => {
    //     if (e.target.value) {
    //         console.log(e.target.value)
    //         setFilterDate(new Date(e.target.value).toISOString().split('T')[0])
    //         fetchLogs(e.target.value)
    //     }
    // }, []);

    // Pagination
    const [page, setPage] = useState(1);
    const rowsPerPage = 9;

    const pages = Math.ceil(((filteredItems?.length) ? filteredItems.length : 1) / rowsPerPage);

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
        return [...items].sort((a: Transfer, b: Transfer) => {
            const first = a[sortDescriptor.column as keyof Transfer] as number;
            const second = b[sortDescriptor.column as keyof Transfer] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const handleEdit = (item: Transfer) => {
        // setTransferName(item.depname)
        // setTransferId(item.depid)
        // setIsSelected(item.isactive)
        // onOpen()
    }

    const handleNew = () => {
        // setTransferName("")
        // setTransferId(0)
        // setIsSelected(true)
        // onOpen()
    }

    // Inputs
    const topContent = useMemo(() => {
        return (
            <div className="flex justify-between gap-4 items-center w-full">
                <Input
                    isClearable
                    // className="w-full sm:max-w-[49%]"
                    placeholder="Search by Product Name..."
                    startContent={<SearchIcon />}
                    value={filterValue}
                    // onClear={() => onClear()}
                    onValueChange={onSearchChange}
                />
                <Button
                    href="/transfer/new"
                    as={Link}
                    color="primary"
                    variant="solid"
                >
                    &#10010; Add
                </Button>
            </div>
        );
    }, [
        filterValue,
        onSearchChange,
        hasSearchFilter,
        transfers?.length,
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

    const renderCell = useCallback((item: Transfer, columnKey: Key) => {
        const cellValue = item[columnKey as keyof Transfer];

        switch (columnKey) {
            case "isactive":
                return (
                    <Chip color={item.status ? "success" : "danger"} variant="bordered"> {item.status ? "Active" : "Inactive"}</Chip>
                )
            case "action":
                return (
                    <div className="relative flex items-center gap-5">
                        <Tooltip content="Edit Transfer" color="secondary">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => { }}>
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete Transfer">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [transfers]);

    return (
        <div className="flex flex-col mx-auto my-0">
            <Table
                color="success"
                isHeaderSticky
                selectionMode="single"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                // defaultSelectedKeys={["2"]} 
                aria-label="User Collection Table"
                bottomContent={bottomContent}
                classNames={{
                    wrapper: "min-h-[111px]",
                }}
                bottomContentPlacement="outside"
                topContent={topContent}
                // topContentPlacement="outside"
            >
                <TableHeader>
                    <TableColumn key="productname" align="start" allowsSorting={true}>Product</TableColumn>
                    <TableColumn key="startdate" align="center" allowsSorting={true}>Date</TableColumn>
                    <TableColumn key="startbyuser" align="center" allowsSorting={true}>Started By</TableColumn>
                    <TableColumn key="status" align="center" allowsSorting={true}>Status</TableColumn>
                    <TableColumn key="action" align="center" allowsSorting={true}>Action</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No Transfers found"}
                    items={sortedData}
                >
                    {(item) => (
                        <TableRow key={item.transfermasterid}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
