import type {QUESTION_T} from "@/types";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
// import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
// import {Badge} from "@/components/ui/badge.tsx";
import {DataGrid} from "@/components/ui/DataGrid.tsx";


interface QuestionModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void,
    data: QUESTION_T[] | null,
    columnDefs: any
}

export function QuestionModal({open, onOpenChange, data, columnDefs}: QuestionModalProps){

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

                {
                    data && (
                        <>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader className="flex items-center gap-2">
                                <DialogTitle>
                                    {"Liste des questions"}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 rounded-md border">

                                <DataGrid
                                    rowData={data}
                                    columnDefs={columnDefs}
                                    getRowId={(params: any) => params.data.id}
                                    height="calc(100vh - 350px)"
                                    rowHeight={55}
                                    defaultColDef={{
                                        sortable: true,
                                        filter: true,
                                        resizable: true,
                                    }}
                                />

                                {/*<Table>*/}
                                {/*    <TableHeader>*/}
                                {/*    <TableRow>*/}
                                {/*        <TableHead>Code</TableHead>*/}
                                {/*        <TableHead>Libellé</TableHead>*/}
                                {/*        <TableHead>Type</TableHead>*/}
                                {/*        <TableHead className="text-center">Ordre</TableHead>*/}
                                {/*        <TableHead className="text-center">Obligatoire</TableHead>*/}
                                {/*    </TableRow>*/}
                                {/*</TableHeader>*/}
                                {/*<TableBody>*/}
                                {/*    {data.map((item, index) => (*/}
                                {/*        <TableRow key={item.id || index}>*/}
                                {/*            <TableCell className="font-medium">*/}
                                {/*                {item.code || '—'}*/}
                                {/*            </TableCell>*/}
                                {/*            <TableCell>{item.libelle}</TableCell>*/}
                                {/*            <TableCell>{item.type_question}</TableCell>*/}
                                {/*            <TableCell className="text-center">{item.ordre}</TableCell>*/}
                                {/*            <TableCell className="text-center">*/}
                                {/*                <Badge variant={item.obligatoire ? 'default' : 'secondary'} className={item.obligatoire ? 'bg-green-500 hover:bg-green-600 text-white' : ''}>*/}
                                {/*                    {item.obligatoire ? 'Oui' : 'Non'}*/}
                                {/*                </Badge>*/}
                                {/*            </TableCell>*/}
                                {/*        </TableRow>*/}
                                {/*    ))}*/}
                                {/*</TableBody>*/}
                                {/*</Table>*/}


                            </div>

                        </DialogContent>
                        </>
                    )
                }

            
        </Dialog>
    )
}
