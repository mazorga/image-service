import { Injectable } from "@nestjs/common";

@Injectable()
export class CombinationHelper{

    getCombinations(arr, n, r, index, data, i,listOfLists)
    {
        // Current combination is ready to
        // be printed, print it
        if (index == r)
        {
            let currList = []
            for (let j = 0; j < r; j++)
            {
                currList.push(data[j])
            }     
            listOfLists.push(currList)
            return;
        }

        // When no more elements are there
        // to put in data[]
        if (i >= n)
            return;

        // current is included, put next
        // at next location
        data[index] = arr[i];
        this.getCombinations(arr, n, r, index + 1,
                                data, i + 1,listOfLists);

        // current is excluded, replace
        // it with next (Note that i+1
        // is passed, but index is not
        // changed)
        this.getCombinations(arr, n, r, index,
                                data, i + 1,listOfLists);
    }
}