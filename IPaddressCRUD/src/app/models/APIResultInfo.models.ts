export interface APIResultInfo {
    success: boolean, 
    action: 'added' | 'updated' | 'deleted', 
    errormessage ?: string
}