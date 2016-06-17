<?php

use Phalcon\Db\Column as Column;

trait ModelBulkInsert {
    
    private $bulkInsertData = '';
    
    private function wrapColumnValue($value, $columnsTypes, $column)
    {
        if (!isset($columnsTypes[$column])) {
            return null;
        }
        switch ($columnsTypes[$column]) {
            case Column::TYPE_INTEGER:
                $value = filter_var($value, FILTER_SANITIZE_NUMBER_INT);
                break;
            case Column::TYPE_BOOLEAN:
                $value = !empty($value) ? 'true' : 'false';
                break;
            case Column::TYPE_JSONB:
                $value = "'".$value."'";
                break;
            default:
                $value = "'".addslashes(filter_var($value, FILTER_SANITIZE_SPECIAL_CHARS))."'";
        }
        return $value;
    }

    public function bulkInsert()
    {
        if (empty($this->bulkInsertData)) {
            return false;
        }
        $metaData = $this->getModelsMetaData();
        $attributes = $metaData->getDataTypes($this);

        $sql = 'INSERT INTO '.$this->getSource(). ' ('.implode(',',array_keys($this->columnMap())).') VALUES ';
        $rows = [];
        foreach ($this->bulkInsertData as $rowData) {
            $values = [];
            foreach ($this->columnMap() as $column => $alias) {
                if (!empty($rowData[$alias])) {
                    $values[] = $this->wrapColumnValue($rowData[$alias], $attributes, $column);
                } else {
                    $values[] = 'DEFAULT';
                }
            }
            if (!empty($values)) {
                $rows[] = '(' . implode(',', $values) . ')';
            }
        }
        if (!empty($rows)) {
            $sql .= implode(',', $rows);
        }
        $this->getWriteConnection()->query($sql);
    }

    public function addToBulkInsert(array $data)
    {
        if (!empty($data)) {
            $this->bulkInsertData[] = $data;
        }
    }    
}
