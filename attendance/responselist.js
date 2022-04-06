
const list = document.getElementById('list')
const urlParams = new URLSearchParams(window.location.search)
const db = urlParams.get('db')
const btn = document.getElementById('btn');
const getData = async()=>{
   
    const result = await axios.get(`/get/${db}`);
   
    for(element in result.data)
    {
        // list.innerHTML += result.data[element].prn + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +  result.data[element].name +  "<br>";
        list.innerHTML += "<tr>"
              +  "<td>" + result.data[element].name + "</td>"+
               "<td>" + result.data[element].prn + "</td>"
         +   "</tr>";
          
    }
}

    getData()

