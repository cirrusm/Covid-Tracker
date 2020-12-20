export const sortData = (data => {
  const sortedData = [...data]; // [...data] just copies out whatever was passed into an array

  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1 
    }else {
        return 1
      }
    })
    return sortedData
  })

