<?php

/**
 * Trait contains common functions to process model's data
 */

trait ModelDataHelper {


    /**
     * Map API data according to the models fields
     * @param array $columnMap
     * @param $providerData
     * @param array $returnData
     * @return array
     */
    private function dataMapping(array $columnMap, $providerData, $returnData = [])
    {
        if (empty($providerData)) {
            return $returnData;
        }

        foreach ($columnMap as $providerField => $dbField) {
            if (is_array($dbField)) {
                $returnData = $this->dataMapping($dbField, $providerData[$providerField], $returnData);
            } elseif (isset($providerData[$providerField])) {
                $returnData[$dbField] = $providerData[$providerField];
            }
        };

        return $returnData;
    }

    /**
     * Take tags list from the $data['tags'] validate and encode to json
     * @param array $data
     */
    public function assignTags(array &$data)
    {
        if (!empty($data['tags'])) {
            array_walk($data['tags'], function(&$tag){
                $tag = filter_var($tag, FILTER_SANITIZE_SPECIAL_CHARS);
            });
            $data['tags'] = json_encode($data['tags']);
        }
    }

    /**
     * Take tags list from the $data['tags'] validate and encode to json
     * @param array $data
     * @param string $field
     */
    public function assignJsonData(array &$data, $field)
    {
        $data[$field] = json_encode($data[$field]);
    }

    /**
     * Set synchronization date 
     */
    public function setSyncDate()
    {
        
        $this->dateSync = 'NOW()';
        
    }

}