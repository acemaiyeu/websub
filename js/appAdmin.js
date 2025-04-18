const host = "https://subwebapi-production.up.railway.app"
// const host = "http://localhost:8888"
const apiUrlLogin = host + "/api/auth/login"
const apiUrl  = host + "/api/v1"

var token = ""
var appAdmin = angular.module('myApp', ['ngRoute']);
if(token == undefined || token == "undefined"){
    window.location.href= "/login.html"
}
appAdmin.controller('HomeController', function($scope, $http) {
    $scope.init = function(){
        token = localStorage.getItem("access_token_admin")
        let time_token = localStorage.getItem('time_token_login_admin')
        if(token == undefined || token == "undefined"){
            window.location.href = "/login.html"
        }

        
        if (time_token != null){
            if ((new Date() - new Date(time_token)) / 1000 > 604800){
                learLocal()
                showErrorPopup("Tài khoản đăng nhập của bạn đã hết hạn!")
                window.location.href = "/login.html"
            }
        }

        $scope.profile()
        window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
    }
    $scope.profile = function(){
        $http({
            method: 'GET',
            url: apiUrl + "/profile",
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function (response) {
            $scope.user = response.data.data
            if ($scope.user.role_code != "SUPERADMIN" && $scope.user.role_code != "DISTRIBUTOR" && $scope.user.role_code != "EMPLOYEE"){
                showErrorPopup("Vui lòng đăng nhập bằng tài khoản admin")
                $scope.logout()
            }
            document.getElementById("dropdownMenuButton").setAttribute("src", "/img/" + $scope.user.avatar)
            document.getElementById("avatar_name").innerText = $scope.user.username
        }
        ).catch(function(error){
            console.log("Error call api profile")
            showErrorPopup(error.message)
            if (error.data.message == "Bạn không có quyền truy cập api này"){
                $scope.logout()
            }
            // showErrorPopup("Tài khoản của bạn đã hết hạn đăng nhập")
            // $scope.logout()
        })
    }
    $scope.init()
});

appAdmin.controller('LoginController', function($scope, $http) {
    
    
    $scope.loginAdmin = function(email, password){
        var email = document.getElementById("email").value
        var password = document.getElementById("password").value

        let data = {
            "email": email,
            "password": password,
            "type": "admin_web"
        }
        $http.post(apiUrlLogin, data)
            .then(function(response) {
                localStorage.setItem('access_token_admin', response.data.access_token)
                localStorage.setItem('expires_in_admin', response.data.expires_in)
                localStorage.setItem('token_type_admin', response.data.token_type)
                localStorage.setItem('time_token_login_admin', new Date())
                window.location.href = "/admin/#!/"
                        
            })
            .catch(function(error) {
            console.log('GET error:', error);
            showErrorPopup("Tài khoản hoặc mật khẩu không chính xác!")
            });        
            
        }
});
appAdmin.controller('VideoController', function($scope, $http, $location) {
    $scope.videos = []
    $scope.init = function(){
        token = localStorage.getItem("access_token_admin")
        if ($location.$$path == "/video-create"){
            $scope.video = {
                'file_ass': ["https://autu-create-link.ass"]
            }
            
        }else{
            $scope.getVideos()
        }
    }

    $scope.addFileInput = function(){
        if (!$scope.video.file_ass) {
            $scope.video.file_ass = [];
        }
        $scope.video.file_ass.push("https://autu-create-link" + ($scope.video.file_ass.length - 1) + getRandomNumbers() +".ass");
    }
    $scope.removeFileInput = function(index){
        $scope.video.file_ass.splice(index,1)
    }
    $scope.saveVideo = function(){
        $http.post(apiUrl + "/video", $scope.video, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function(res){
            alertCustom("Đã lưu thành công!")
            
            if ($location.$$path == "/video-create"){
                window.location.href = "#!/videos"
            }else{
                $('#editModal').modal('hide');
            }
        }).catch(function(e){
            console.log(e)
            showErrorPopup(e.data.message)
        })
    }
    $scope.getVideos = function(){
        $http({
            url: apiUrl + "/videos",
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response){
            $scope.videos = response.data.data
        }).catch(function(e){

        })
    }
    $scope.updateVideo = function(video){
        $scope.video = video
        $scope.saveVideo()
    }

    
    $scope.init()
    function getRandomNumbers() {
        let num1 = Math.floor(Math.random() * 100) + 1;
        let num2 = Math.floor(Math.random() * 100) + 1;
        // console.log(num1, num2);
        return num1
    }
    
    
    //Filter

    $scope.applyFilter = function() {
        let titleFilter = document.getElementById('searchTitle').value.toLowerCase();
        let dateFilter = document.getElementById('filterDate').value;
        let sortOption = document.getElementById('sortOption').value;
        
        let rows = Array.from(document.querySelectorAll('#videoList tr'));
        rows.forEach(row => {
            let title = row.cells[0].innerText.toLowerCase();
            let date = row.cells[2].innerText;
            row.style.display = (title.includes(titleFilter) && (!dateFilter || date === dateFilter)) ? '' : 'none';
        });

        if (sortOption) {
            rows.sort((a, b) => {
                let valA = sortOption === 'views' ? parseInt(a.cells[1].innerText) : new Date(a.cells[2].innerText);
                let valB = sortOption === 'views' ? parseInt(b.cells[1].innerText) : new Date(b.cells[2].innerText);
                return valB - valA;
            });
            document.getElementById('videoList').innerHTML = '';
            rows.forEach(row => document.getElementById('videoList').appendChild(row));
        }
    }

    $scope.confirmDelete = function(id) {
        // rowToDelete = button.closest('tr');
        // let title = rowToDelete.cells[0].innerText;
        // document.getElementById('videoToDelete').innerText = title;
        $scope.delete_video = id
        $('#confirmDeleteModal').modal('show');

    }
    $scope.deleteById = function(){
        $http({
            url: apiUrl + "/video/" + $scope.delete_video,
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response){
            $scope.getVideos()
        }).catch(function(e){

        })
    }



     $scope.editVideo = function(video) {
        // rowToEdit = button.closest('tr');
        // document.getElementById('editTitle').value = rowToEdit.cells[0].innerText;
        // document.getElementById('editViews').value = rowToEdit.cells[1].innerText;
        // document.getElementById('editDate').value = rowToEdit.cells[2].innerText;
        $scope.video = video
        $('#editModal').modal('show');
    }

     $scope.saveEdit = function() {
        if (rowToEdit) {
            rowToEdit.cells[0].innerText = document.getElementById('editTitle').value;
            rowToEdit.cells[1].innerText = document.getElementById('editViews').value;
            rowToEdit.cells[2].innerText = document.getElementById('editDate').value;
            $('#editModal').modal('hide');
        }
    }
    $scope.addImageThumbnail = async function(){
        // $scope.product_create.images[$scope.product_create.images.length] = (document.getElementById("add_product_image").value).replace("C:\\fakepath\\","") 
        let files = document.getElementById("image_thumbnail").files
        let fileNames = [];
        // $scope.product_create.images = []
        for (let i = 0; i < files.length; i++) {
            // $scope.products.images[] =  $scope.uploadImage(files[i])
            $scope.uploadImage(files[i])
        }    
}
$scope.uploadImage = function(file) {
    let formData = new FormData();
    formData.append("image", file);

    $http.post(host + "/api/client/upload-image", formData, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
    }).then(function(response) {
        // console.log("Upload thành công:", response.data);
        // console.log("URL: " + response.data.link)
        $scope.video.thumbnail_img = response.data.link
        alertCustom(("Upload thành công:"))
        console.log($scope.product_create.images)
       return $scope.uploadedFilePath = response.data.filePath;
       
    }).catch(function(error) {
        console.error("Lỗi upload ảnh:", error);
        showErrorPopup("Lỗi upload ảnh:", error.data.message);
    });
};

})
function learLocal(){
    localStorage.removeItem('access_token_admin')
    localStorage.removeItem('expires_in_admin')
    localStorage.removeItem('token_type_admin')
    localStorage.removeItem('time_token_login_admin')
}
function logout(){
    learLocal()
    // document.getElementById('img-profile').setAttribute("hidden", "hidden")
    // document.getElementById('submit-login').removeAttribute('hidden')
}


