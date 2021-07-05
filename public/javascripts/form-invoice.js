var addButton = document.getElementById("btn-add")
const table = document.getElementById('tableBody')
const preVatTotal = document.getElementById('pre_vat_total')
const vat = document.getElementById('vat')
const grandTotal = document.getElementById('grand_total')

///////////////////////////////////////////////////////////////////////////////////////////////////
// feach product from database and add to invoice list
addButton.addEventListener("click", () => {
   

    let productid = document.getElementById('quoteitemcode').value;
   
    fetch('/admin/fetchproduct/' + productid, {
        method: "POST"
    }).then((res) => {
        if (res.redirected) {
            alert("Server Rejected your requiest due to expire  .. Need to login")
            location.reload(true);

        } else {
            return (res)
        }
    }).then((res) => res.json())
        .then((res) => {
            let itemQty = document.getElementById("item-qty").value;
            let productTotal = itemQty * res.data.productRate
            let productFound= false
            let selectedRow
            
            for (var i = 0; i < table.rows.length; i++) {
                if(res.data.itemCode==table.rows[i].cells[0].innerHTML){
                    productFound=true
                    selectedRow=table.rows[i]
                }

            }
            if(productFound){
                if(selectedRow.cells[2].innerHTML==""){
                    selectedRow.cells[2].innerHTML=0
                }
              itemQty=parseInt(itemQty) +parseInt(selectedRow.cells[2].innerHTML)
              selectedRow.cells[2].innerHTML=itemQty
              selectedRow.cells[4].innerHTML=itemQty*res.data.productRate

            }else{
                document.getElementById("tableBody").innerHTML += ' <tr><td>' + res.data.itemCode + '</td><td>' + res.data.productDescription + '</td><td>' + itemQty + '</td><td>' + res.data.productRate + '</td><td>' + productTotal + '</td><td><i class="fas fa-trash"></i></td></tr>'
            }
            
        }).then(() => {
            let sumVal = 0;


            for (var i = 0; i < table.rows.length; i++) {
                sumVal = sumVal + parseInt(table.rows[i].cells[4].innerHTML)
                preVatTotal.innerHTML = sumVal + '/-'

                var percent = (5 / 100) * sumVal;
                var grand_total = sumVal + percent
                vat.innerHTML = percent
                grandTotal.innerHTML = grand_total


            }


        })
        .catch(() => {
            alert("Item code You Enterd is incorrect")
        })
})


///////////////////////////////////////////////////////////////////////////////////////////////////
// confirm leaving from invoice or quote
function myConfirmation() {
    return 'Are you sure you want to quit?';
}

window.onbeforeunload = myConfirmation;

///////////////////////////////////////////////////////////////////////////////////////////////////

// auto complete whn typing itemcode
let productid = document.getElementById('quoteitemcode');
productid.addEventListener("input", () => {
    document.getElementById('itemcodelist').innerHTML = ''
    let value = productid.value

    fetch('/admin/serchproduct/' + value, {
        method: "POST"
    }).then((res) => res.json())
        .then((res) => {

            for (i = 0; i < res.length; i++) {


                document.getElementById('itemcodelist').innerHTML += '<option value="' + res[i].itemCode + '"><span class="h6"> '+res[i].productDescription+'<h6>'
            }
        })


})

///////////////////////////////////////////////////////////////////////////////////////////////////

// prevent repeat in invoice list

