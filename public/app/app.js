angular.module("shareonride", [ "ui.router", "ngDialog", "720kb.datepicker", "ngCookies" ]).run(function($rootScope, $state, $cookieStore, authService) {
    $rootScope.saleId = "", $rootScope.authenticated = !1, $rootScope.idCapture = !1, 
    $rootScope.currentUser = "", $rootScope.$on("$stateChangeStart", function(event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;
        if (requireLogin && null == authService.getUserInfo()) return event.preventDefault(), 
        $state.go("login");
    }), $rootScope.$on("$stateChangeSuccess", function(ev, to, toParams, from, fromParams) {
        if (window.scrollTo(0, 0), from.data) {
            var loginStateReverse = from.data.loginStateReverse;
            loginStateReverse ? $rootScope.previousState = from.name : $rootScope.previousState = "main.front";
        }
        $rootScope.currentState = to.name;
    }), $rootScope.$on("$stateChangeError", function(event, current, previous, eventObj) {
        event.authenticated === !1 && $state.go("login");
    });
}), angular.module("shareonride").config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state("login", {
        url: "/login",
        templateUrl: "app/components/login/login.html",
        controller: "login",
        data: {
            requireLogin: !1,
            loginStateReverse: !1
        }
    }).state("logout", {
        url: "/logout",
        templateUrl: "app/components/logout/logout.html",
        controller: "logoutController",
        data: {
            requireLogin: !1,
            loginStateReverse: !1
        }
    }).state("register", {
        url: "/register",
        templateUrl: "app/components/register/register.html",
        controller: "register",
        data: {
            requireLogin: !1,
            loginStateReverse: !1
        }
    }).state("resendEmail", {
        url: "/resendEmail",
        templateUrl: "app/components/register/resendEmail.html",
        controller: "register",
        data: {
            requireLogin: !1,
            loginStateReverse: !1
        }
    }).state("forgotPass", {
        url: "/forgetPassword",
        templateUrl: "app/components/forgetPassword/forgotPassword.tpl.html",
        controller: "forgetPasswordController",
        data: {
            requireLogin: !1,
            loginStateReverse: !1
        }
    }).state("resetpwd", {
        url: "/resetPwd/:tokenId",
        templateUrl: "app/components/forgetPassword/resetPassword.tpl.html",
        controller: "resetController",
        data: {
            requireLogin: !1,
            loginStateReverse: !1
        },
        resolve: {
            auth: function(forgetPasswordService, $stateParams) {
                return forgetPasswordService.resetPwd($stateParams.tokenId);
            }
        }
    }).state("userVerify", {
        url: "/user/confirmation/:token",
        templateUrl: "assets/html/verification.html",
        controller: "signupController",
        data: {
            requireLogin: !1,
            loginStateReverse: !1
        }
    }).state("main.vendorProfile", {
        url: "vendorProfile/:id",
        templateUrl: "app/components/vendorProfile/vendorProfile.html",
        controller: "ProfileController",
        data: {
            requireLogin: !1,
            loginStateReverse: !0
        }
    }).state("main", {
        url: "/",
        views: {
            "": {
                templateUrl: "app/components/main/main.html",
                controller: "main"
            },
            "head@main": {
                templateUrl: "app/shared/head/head.html",
                controller: "headControl"
            },
            "footer@main": {
                templateUrl: "app/shared/footer/footer.html"
            },
            "submenu@main": {
                templateUrl: "app/shared/menu/menu.html"
            }
        },
        data: {
            requireLogin: !1,
            loginStateReverse: !0
        }
    }).state("main.subMenu", {
        url: "submenu",
        views: {
            "": {
                templateUrl: "app/shared/subMenu/subMenu.html"
            }
        },
        data: {
            requireLogin: !0,
            loginStateReverse: !0
        }
    }).state("main.settings", {
        url: "settings",
        templateUrl: "app/components/settings/settings.html",
        data: {
            requireLogin: !0,
            loginStateReverse: !0
        }
    }).state("main.settings.changePassword", {
        url: "/changePassword",
        templateUrl: "app/components/change-password/change-password.html",
        controller: "changePasswordController",
        data: {
            requireLogin: !0,
            loginStateReverse: !0
        }
    }).state("main.front", {
        url: "front",
        templateUrl: "app/components/front/front.html",
        controller: "frontController",
        data: {
            requireLogin: !1,
            loginStateReverse: !0
        }
    }).state("main.rides", {
        url: "rides",
        templateUrl: "app/components/rides/rides.html",
        controller: "ridesController",
        data: {
            requireLogin: !1,
            loginStateReverse: !0
        }
    }).state("main.findride", {
        url: "find",
        templateUrl: "app/components/rides/allTrips.html",
        controller: "tripsController",
        data: {
            requireLogin: !1,
            loginStateReverse: !0
        }
    }).state("main.profile", {
        url: "profile",
        templateUrl: "app/components/profile/profile.html",
        controller: "profile",
        data: {
            requireLogin: !0,
            loginStateReverse: !0
        }
    }), $urlRouterProvider.otherwise("/login");
}), angular.module("shareonride").factory("globalVars", [ "$state", function($state, $ionicHistory, $location) {
    return {
        baseURL: "http://localhost/api",
        config: {
            headers: {
                "Content-Type": "application/json"
            }
        },
        orderId: "",
        userData: {
            userId: "",
            lName: "",
            uId: ""
        },
        sales: [],
        wishlist: [],
        logoutOfApp: function() {
            $state.go("appintro"), authorizeCode = "";
        },
        clearCredentials: function() {
            return {
                authorizeCode: "d3320700c334d542b65fb1a3afecdd7f",
                userInfoPic: "thumb_71596cfa270bba272816be92800ae0c0_thumb.jpg",
                userFirstName: "Buzz",
                userLastName: "Book",
                friendList: []
            };
        }
    };
} ]).filter("reverse", function() {
    return function(items) {
        return items.slice().reverse();
    };
}).factory("lookupService", [ "$http", "globalVars", "$q", function($http, globalVars, $q) {
    var allServices = {};
    return allServices.lookUpError = function() {
        var errorData = {
            "error.user.password.required": "Please Enter the password",
            "error.login.user.Invalid": "Your Email doesn't Exists / Email not Authorised",
            "error.username.password.mismatch": "Password doesn't match, please check the password",
            "error.user.username.required": "Please Enter your Registered Email address",
            "error.user.email.notFound": "Invalid email address, please enter your registered email address",
            "error.user.email.NotVerified": "Email not Verified, please check you email to authenticate"
        };
        return errorData;
    }, allServices;
} ]).factory("GlobalServiceResource", [ "$http", "globalVars", function($http, globalVars) {
    var allServices = {};
    return allServices.slidingBar = function(qty, totalDiv, discountData) {}, allServices.uploadImage = function(fileData, callback) {
        $http({
            method: "POST",
            url: globalVars.baseURL + "/file/base64/upload",
            data: {
                imgbase64: fileData
            },
            headers: {
                "Content-Type": "application/json"
            }
        }).success(function(data, status) {
            callback(data.imageURL);
        }).error(function(data, status) {});
    }, allServices.userAllProducts = function() {
        var userId = globalVars.userData.userId, finalUrl = globalVars.baseURL + "/products/" + userId + "/listProducts";
        return $http.get(finalUrl, function(res) {
            return res;
        });
    }, allServices.saleList = function() {
        var userId = globalVars.userData.userId, finalUrl = globalVars.baseURL + "/products/" + userId + "/listsales";
        return $http.get(finalUrl, function(res) {
            return res;
        });
    }, allServices.orderList = function() {
        var userId = globalVars.userData.userId, finalUrl = globalVars.baseURL + "/orders/" + userId + "/listorders";
        return $http.get(finalUrl, function(res) {
            return res;
        });
    }, allServices.forgetPassword = function() {
        var userId = globalVars.userData.userId, finalUrl = globalVars.baseURL + "/products/" + userId + "/forget-password";
        return $http.get(finalUrl, function(res) {
            return res;
        });
    }, allServices.dialog = function(dial) {
        ngDialog.open({
            template: "assets/html/" + dial + ".html",
            className: "ngdialog-theme-default"
        });
    }, allServices;
} ]).directive("slidingBar", function() {
    return {
        restrict: "A",
        templateUrl: "app/shared/slidingComponent.html",
        transclude: !1,
        scope: {
            saleDiscount: "=",
            totalQty: "=",
            soldQty: "=",
            barData: "@"
        },
        link: function(scope, element) {
            function sortResults(prop, asc, arr) {
                arr = arr.sort(function(a, b) {
                    return asc ? a[prop] > b[prop] : b[prop] > a[prop];
                });
            }
            var finalValue = {
                sale_qty: scope.totalQty,
                sale_discount_percentage: 0
            };
            sortResults("sale_qty", !0, scope.saleDiscount), scope.totalQty != scope.saleDiscount[scope.saleDiscount.length - 1].sale_qty && scope.saleDiscount.push(finalValue), 
            scope.saleStyle = function(x) {
                var y = x / scope.saleDiscount.length;
                return 100 * y;
            }, scope.barLength = function() {
                var countInit = 0, tempVal = 0;
                for (i = 0; i < scope.saleDiscount.length; i++) if (scope.saleDiscount[i].sale_qty >= scope.soldQty) return 0 != i && (countInit = 100 / scope.saleDiscount.length * i, 
                tempVal = scope.saleDiscount[i - 1].sale_qty), countInit + (scope.soldQty - tempVal) / (scope.saleDiscount[i].sale_qty - tempVal) * (100 / scope.saleDiscount.length);
            };
        }
    };
}), angular.module("shareonride").controller("changePasswordController", [ "$scope", "authService", "$http", "$rootScope", "$state", "globalVars", "ngDialog", "changePasswordService", function($scope, authService, $http, $rootScope, $state, globalVars, ngDialog, changePasswordService) {
    $scope.setPassword = function() {
        if ($scope.newPassword == $scope.confirmPassword) {
            if ($scope.newPassword.length < 8) return void ngDialog.open({
                template: "<span style='padding:10px 20px;'>Password length should be of minimum eight digits</span>",
                plain: !0
            });
            ngDialog.open({
                template: "<p>Updating... </p>",
                plain: !0
            }), changePasswordService.changePassword($scope.oldPassword, $scope.newPassword, $scope.confirmPassword).success(function(data, status) {
                ngDialog.closeAll(), $scope.oldPassword = $scope.newPassword = $scope.confirmPassword = "", 
                ngDialog.open({
                    template: '<span style="padding:10px 20px;">password Change succesful</span>',
                    plain: !0
                }), $state.go("main.front");
            }).error(function(data, status) {
                "error.user.password.small" == data.error && ngDialog.open({
                    template: "<span style='padding:10px 20px;'>Password length should be of minimum eight digits</span>",
                    plain: !0
                }), "error.user.oldPassword.wrong" == data.error && (ngDialog.open({
                    template: "<span style='padding:10px 20px;'>incorrect old password</span>",
                    plain: !0
                }), $scope.oldPassword = $scope.newPassword = $scope.confirmPassword = "");
            });
        }
        $scope.newPassword !== $scope.confirmPassword && (ngDialog.open({
            template: "<span style='padding:10px 20px;'>Confirm password doesn't match</span>",
            plain: !0
        }), $scope.newPassword = "", $scope.confirmPassword = "");
    };
} ]), angular.module("shareonride").factory("changePasswordService", [ "$http", "globalVars", "ngDialog", function($http, globalVars, ngDialog) {
    var allServices = {};
    return allServices.changePassword = function(old, new1, confirm) {
        var finalUrl = (globalVars.userData.userId, globalVars.baseURL + "/user/" + globalVars.userData.userId + "/change-password");
        return $http({
            method: "POST",
            url: finalUrl,
            data: {
                oldPassword: old,
                password: new1,
                confirmPassword: confirm
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + globalVars.userData.uId
            }
        });
    }, allServices.dialog = function(dial) {
        ngDialog.open({
            template: "assets/html/" + dial + ".html",
            className: "ngdialog-theme-default"
        });
    }, allServices;
} ]), angular.module("shareonride").controller("forgetPasswordController", [ "$scope", "forgetPasswordService", "ngDialog", "$state", "lookupService", function($scope, forgetpass, ngDialog, $state, lookupService) {
    $scope.errorMessage12 = lookupService.lookUpError(), $scope.getNewPassword = function(email1) {
        forgetpass.password(email1).success(function(data, status) {}).success(function() {
            ngDialog.open({
                template: '<p style="padding: 10px 20px;">Password reset link has been send to your registered email.</p>',
                plain: !0
            }), $state.go("login");
        }).error(function(data) {
            $scope.err = data.error, ngDialog.open({
                template: "<p>" + $scope.errorMessage12[$scope.err] + "</p>",
                plain: !0
            });
        });
    }, $scope.cancel = function() {
        $state.go("login");
    }, $scope.clickToOpen = function(error) {
        forgetpass.dialog(error);
    };
} ]), angular.module("shareonride").factory("forgetPasswordService", [ "$http", "globalVars", "ngDialog", function($http, globalVars, ngDialog) {
    var allServices = {};
    return allServices.password = function(email) {
        var finalUrl = (globalVars.userData.userId, globalVars.baseURL + "/user/buyer/forgot-password");
        return $http({
            method: "POST",
            url: finalUrl,
            data: {
                email: email
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + globalVars.userData.uId
            }
        });
    }, allServices.resetPwd = function(token) {
        return $http.get(globalVars.baseURL + "/user/verify/token/" + token);
    }, allServices.dialog = function(dial) {
        ngDialog.open({
            template: "assets/html/" + dial + ".html",
            className: "ngdialog-theme-default"
        });
    }, allServices;
} ]), angular.module("shareonride").controller("resetController", [ "$http", "$scope", "$stateParams", "globalVars", "$state", "$location", "auth", "ngDialog", "forgetPasswordService", function($http, $scope, $stateParams, globalVars, $state, $location, auth, ngDialog, forgetPasswordService) {
    $scope.temp1 = !0, "success" === auth.data.message ? ($scope.temp1 = !0, $scope.temp2 = !1) : ($scope.temp1 = !1, 
    $scope.temp2 = !0, $location.path("/login")), $scope.resetPassword = function(pwd, repwd) {
        return pwd == repwd && pwd.length > 8 ? void $http({
            method: "POST",
            url: globalVars.baseURL + "/user/reset-password?token=" + $stateParams.tokenId,
            data: {
                password: pwd,
                confirmPassword: repwd
            }
        }).success(function(data, status) {
            ngDialog.open({
                template: "<p>Your password has been changed</p>",
                plain: !0
            }), $location.path("/login");
        }) : pwd.length < 8 ? void ($scope.error = "your password has insufficient length. your password should be atleast 9 digits") : ($scope.error = "your password doesn't match. please ReEnter the password", 
        $scope.pwd = "", void ($scope.repwd = ""));
    }, $scope.gotoLogin = function() {
        $location.path("/login");
    }, $scope.clickToOpen = function(error) {
        forgetPasswordService.dialog(error);
    }, $scope.passwordCheck = function() {
        return $scope.pwd && $scope.repwd && $scope.pwd == $scope.repwd ? "" : $scope.pwd && $scope.repwd ? "password doesn't match" : void 0;
    };
} ]), angular.module("shareonride").controller("frontController", [ "$scope", "authService", "$http", "$rootScope", "$state", "$location", function($scope, authService, $http, $rootScope, populateSale, $state, $location) {
    $scope.userLogindata = authService.getUserInfo(), $scope.data = {}, flatpickr(".flatpickr", {
        enableTime: !0
    }), $scope.createRide = function() {
        $scope.loadingProgress = !0, authService.createRide($scope.userLogindata.userId, $scope.data).then(function(result) {
            alert("Successfully Created"), $scope.data = {}, console.log(result);
        }, function(error) {
            $scope.errorText = error.error, $scope.err = error.data.error, $scope.loadingProgress = !1, 
            $scope.loginError = $scope.errorMessage12[$scope.err];
        });
    };
} ]), angular.module("shareonride").factory("populateSale", [ "$http", "globalVars", function($http, globalVars) {
    var saleValue = {};
    return saleValue.getSaleListTrending = function() {
        return $http({
            method: "GET",
            url: globalVars.baseURL + "/sales/list/trending",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }, saleValue.getSaleListNew = function() {
        return $http({
            method: "GET",
            url: globalVars.baseURL + "/sales/list/new",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }, saleValue.getSaleListBest = function() {
        return $http({
            method: "GET",
            url: globalVars.baseURL + "/sales/list/upcoming",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }, saleValue;
} ]), angular.module("shareonride").controller("login", [ "$scope", "authService", "$http", "$window", "$rootScope", "$q", "$state", "globalVars", "$location", "lookupService", "ngDialog", function($scope, authService, $http, $window, $rootScope, $q, $state, globalVars, $location, lookupService, ngDialog) {
    $scope.signupon = !1, $scope.dataLogin = [], $scope.dataRegister = [], $scope.genders = [ "Male", "Female" ], 
    $scope.loadingProgress = !1, $rootScope.previousState = "", $scope.errorMessage12 = lookupService.lookUpError(), 
    $scope.accountCreate = function(boolData) {
        $scope.signupon = !boolData, $scope.errorText = "";
    }, $scope.errorText = "", $scope.passwordCheck = function() {
        return $scope.dataRegister.password && $scope.dataRegister.repassword && $scope.dataRegister.password == $scope.dataRegister.repassword ? "" : $scope.dataRegister.password && $scope.dataRegister.repassword ? "password doesn't match" : void 0;
    }, $scope.loginClear = function() {
        $scope.dataLogin.email = "", $scope.dataLogin.password = "", $scope.loginError = "";
    }, $scope.loginWork = function(dataLogin) {
        $scope.loadingProgress = !0, authService.login($scope.dataLogin).then(function(result) {
            console.log("logged in"), console.log(result), $window.sessionStorage.userInfo = JSON.stringify(result), 
            globalVars.userData.uId = result.accessToken, globalVars.userData.userId = result.userId, 
            $scope.loadingProgress = !1, 1 == $rootScope.idCapture ? ($state.go($rootScope.previousState, {
                id: $rootScope.saleId
            }), $rootScope.idCapture = !1, $rootScope.saleId = "") : "" != $rootScope.previousState ? $state.go($rootScope.previousState) : "DRIVER" === result.role ? $state.go("main.front") : $state.go("main.findride");
        }, function(error) {
            $scope.errorText = error.error, $scope.loginstatus = 1, $scope.err = error.data.error, 
            $scope.loadingProgress = !1, $scope.loginError = $scope.errorMessage12[$scope.err];
        });
    };
} ]), angular.module("shareonride").controller("signupController", [ "$http", "$scope", "$stateParams", "globalVars", "$state", function($http, $scope, $stateParams, globalVars, $state) {
    $http.get(globalVars.baseURL + "/user/confirmation/" + $stateParams.token).then(function(data) {
        $scope.temp1 = !0;
    }, function() {
        $scope.temp1 = !1;
    }), $scope.gotoLogin = function() {
        $state.go("login");
    };
} ]), angular.module("shareonride").controller("logoutController", [ "$scope", "authService", "$rootScope", "$state", "$location", function($scope, authService, $rootScope, $state, $location) {
    authService.logout();
} ]), angular.module("shareonride").controller("main", [ "$scope", "$http", "$stateParams", "$rootScope", "globalVars", "authService", "mainService", "$state", function($scope, $http, $stateParams, $rootScope, globalVars, authService, mainServiceMethods, $state) {
    $rootScope.hasSubMenu = !1, $scope.dataLogin = [], $scope.searchValue = {}, $scope.searchSubmit = function(searchValue) {
        searchValue.value && $state.go("main.sales", {
            id: "search",
            value: searchValue.value
        });
    };
} ]), angular.module("shareonride").factory("mainService", [ "$http", "globalVars", function($http, globalVars) {
    var mainServiceMethods = {};
    return mainServiceMethods;
} ]), angular.module("shareonride").controller("profile", [ "$scope", "$http", "$rootScope", "globalVars", function($scope, $http, $rootScope, globalVars) {
    $rootScope.hasSubMenu = !1, $scope.PostValues = [], $scope.UsedId = globalVars.userData.userId, 
    $scope.uId = globalVars.userData.uId, $scope.Friends = [], $scope.listFriends = function() {
        $http({
            method: "GET",
            url: globalVars.baseURL + "/friend/" + $scope.UsedId + "/listfriends",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + $scope.uId
            }
        }).success(function(data, status) {
            $scope.Friends = data;
        }).error(function(data, status) {});
    }, $scope.loadPosts = function() {
        $http({
            method: "GET",
            url: globalVars.baseURL + "/feed/" + $scope.UsedId + "/listallfeeds",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + $scope.uId
            }
        }).success(function(data, status) {
            $scope.PostValues = data;
        }).error(function(data, status) {});
    }, $scope.loadPosts(), $scope.listFriends();
} ]), angular.module("shareonride").controller("register", [ "$scope", "$http", "$rootScope", "globalVars", "$location", "lookupService", "ngDialog", "$state", function($scope, $http, $rootScope, globalVars, $location, lookupService, ngDialog, $state) {
    $scope.signupon = !0, $scope.dataLogin = [], $scope.dataRegister = [], $scope.genders = [ "Male", "Female" ], 
    $scope.loadingProgress = !1, $scope.dataRegister.role = "driver", $scope.errorMessage12 = lookupService.lookUpError(), 
    $scope.accountCreate = function(boolData) {
        $scope.signupon = !boolData, $scope.errorText = "";
    }, $scope.errorText = "", $scope.registerWork = function(dataRegister) {
        $rootScope.resendEmail1 = $scope.dataRegister.email, $scope.loadingProgress = !0, 
        $http({
            method: "POST",
            url: globalVars.baseURL + "/user/register",
            data: {
                name: $scope.dataRegister.firstName,
                email: $scope.dataRegister.email,
                password: $scope.dataRegister.password,
                mobile: $scope.dataRegister.mobile,
                address: $scope.dataRegister.address,
                city: $scope.dataRegister.city,
                zip: $scope.dataRegister.zip,
                driverLicense: $scope.dataRegister.driverLicense,
                role: $scope.dataRegister.role
            },
            headers: {
                "Content-Type": "application/json"
            }
        }).success(function(data, status) {
            console.log(data, status), registerSuccess = !0, $scope.signupon = !1, $scope.loadingProgress = !1, 
            $scope.loginstatus = 1, $scope.dataRegister = "", $state.go("resendEmail");
        }).error(function(data, status) {
            console.log(data, status), $scope.errorText = data.message, $scope.loadingProgress = !1, 
            ngDialog.open({
                template: "<p>" + $scope.errorText + "</p>",
                plain: !0
            });
        });
    }, $scope.passwordCheck = function() {
        return $scope.dataRegister.password && $scope.dataRegister.repassword && $scope.dataRegister.password == $scope.dataRegister.repassword ? "" : $scope.dataRegister.password && $scope.dataRegister.repassword ? "password doesn't match" : void 0;
    }, $scope.resendEmail = function(x) {
        $http({
            method: "POST",
            url: globalVars.baseURL + "/user/buyer/resendemail",
            data: {
                email: $rootScope.resendEmail1
            },
            headers: {
                "Content-Type": "application/json"
            }
        }).success(function(data, status) {}).error(function(data, status) {});
    }, $scope.registerClear = function() {
        $state.reload();
    };
} ]), angular.module("shareonride").controller("successControls", [ "$scope", "$http", "$rootScope", "globalVars", "$location", function($scope, $http, $rootScope, globalVars, $location) {
    $scope.signupon = !1, $scope.dataLogin = [], $scope.dataRegister = [], $scope.accountCreate = function(boolData) {
        $scope.signupon = !boolData, $scope.errorText = "", $scope.apply();
    }, $scope.errorText = "";
} ]), angular.module("shareonride").controller("ridesController", [ "$scope", "authService", "$http", "$rootScope", "$state", "$location", function($scope, authService, $http, $rootScope, populateSale, $state, $location) {
    function findMyTrips() {
        console.log($scope.userLogindata), $scope.loadingProgress = !0, authService.findMyRides($scope.userLogindata.userId).then(function(result) {
            console.log(result), $scope.allTrips = result.data;
        }, function(error) {
            $scope.errorText = error.error, $scope.err = error.data.error, $scope.loadingProgress = !1, 
            $scope.loginError = $scope.errorMessage12[$scope.err];
        });
    }
    $scope.userLogindata = authService.getUserInfo(), findMyTrips();
} ]), angular.module("shareonride").controller("tripsController", [ "$scope", "authService", "$http", "$rootScope", "$state", "$location", function($scope, authService, $http, $rootScope, populateSale, $state, $location) {
    $scope.userLogindata = authService.getUserInfo(), $scope.data = {}, $scope.driverDetails = {}, 
    flatpickr(".flatpickr"), $scope.findAllTrips = function() {
        $scope.loadingProgress = !0, authService.findRides($scope.data).then(function(result) {
            console.log(result), $scope.allTrips = result;
        }, function(error) {
            $scope.errorText = error.error, $scope.err = error.data.error, $scope.loadingProgress = !1, 
            $scope.loginError = $scope.errorMessage12[$scope.err];
        });
    }, $scope.contactDriver = function(trip) {
        $scope.driverDetails = trip, $("#myModal").modal();
    };
} ]), angular.module("shareonride").controller("headControl", [ "$scope", "$http", "authService", "$rootScope", "$state", "globalVars", function($scope, $http, authService, $rootScope, $state, globalVars) {
    $scope.userLogindata = authService.getUserInfo(), $scope.showDriver = !0, "NONDRIVER" === $scope.userLogindata.role && ($scope.showDriver = !1);
} ]), angular.module("shareonride").factory("authService", [ "$http", "globalVars", "$q", "$window", function($http, globalVars, $q, $window) {
    function login(credentials) {
        var deferred = $q.defer(), data = {
            identifier: credentials.email,
            password: credentials.password
        };
        return $http.post(globalVars.baseURL + "/user/login", data, globalVars.config).then(function(result) {
            userInfo = {
                name: result.data.user.name,
                role: result.data.user.role,
                userId: result.data.user._id,
                accessToken: result.data.tokenId
            }, deferred.resolve(userInfo);
        }, function(error) {
            deferred.reject(error);
        }), deferred.promise;
    }
    function logout() {
        var deferred = $q.defer();
        return $window.sessionStorage.userInfo = null, deferred.promise;
    }
    function getUserInfo() {
        return $window.sessionStorage.userInfo && (userInfo = JSON.parse($window.sessionStorage.userInfo), 
        null != userInfo ? (globalVars.userData.uId = userInfo.accessToken, globalVars.userData.userId = userInfo.userId) : ($window.sessionStorage.userInfo = null, 
        globalVars.userData.uId = "", globalVars.userData.userId = "")), userInfo;
    }
    function init() {
        $window.sessionStorage.userInfo ? userInfo = JSON.parse($window.sessionStorage.userInfo) : $window.sessionStorage.userInfo = null;
    }
    function findRides(data) {
        var deferred = $q.defer();
        return $http.post(globalVars.baseURL + "/list/find/trips", data, globalVars.config).then(function(result) {
            deferred.resolve(result.data);
        }, function(error) {
            deferred.reject(error);
        }), deferred.promise;
    }
    function findMyRides(driverId) {
        return $http.get(globalVars.baseURL + "/list/all/" + driverId + "/trips");
    }
    function createRide(driverId, data) {
        var deferred = $q.defer();
        return $http.post(globalVars.baseURL + "/create/" + driverId + "/trip", data, globalVars.config).then(function(result) {
            deferred.resolve(result.data);
        }, function(error) {
            deferred.reject(error);
        }), deferred.promise;
    }
    function mailToDriver(userId, data) {
        var deferred = $q.defer();
        return $http.post(globalVars.baseURL + "/contact/" + userId + "/driver", data, globalVars.config).then(function(result) {
            deferred.resolve(result.data);
        }, function(error) {
            deferred.reject(error);
        }), deferred.promise;
    }
    var userInfo = {};
    return init(), {
        login: login,
        logout: logout,
        getUserInfo: getUserInfo,
        findRides: findRides,
        findMyRides: findMyRides,
        createRide: createRide,
        mailToDriver: mailToDriver
    };
} ]), angular.module("shareonride").factory("lookupService", [ "$http", "globalVars", function($http, globalVars) {
    var allServices = {};
    return allServices.lookUpError = function() {
        var errorData = {
            "error.user.password.required": "Please Enter the password",
            "error.login.user.Invalid": "Your Email doesn't Exists / Email not Authorised",
            "error.username.password.mismatch": "Your credentials doesn't match, please check the credentials",
            "error.user.username.required": "Please Enter your Registered Email address",
            "error.user.email.notFound": "Invalid email address, please enter your registered email address"
        };
        return errorData;
    }, allServices;
} ]).directive("countdown", [ "Util", "$interval", "$timeout", function(Util, $interval, $timeout) {
    return {
        restrict: "A",
        templateUrl: "app/shared/timerTemplate.html",
        scope: {
            date: "@",
            comingTime: "@",
            currenttime: "@"
        },
        link: function(scope, element) {
            function scounter() {
                return counter += 1e3;
            }
            var future;
            future = new Date(scope.date);
            var counter = new Date(scope.currenttime).getTime();
            $interval(function() {
                var diff;
                diff = Math.floor((future.getTime() - scounter()) / 1e3), scope.comingTime = Util.dhms(diff);
            }, 1e3);
        }
    };
} ]).factory("Util", [ function() {
    return {
        dhms: function(t) {
            var days, hours, minutes, seconds;
            return days = Math.floor(t / 86400), t -= 86400 * days, hours = Math.floor(t / 3600) % 24, 
            t -= 3600 * hours, minutes = Math.floor(t / 60) % 60, t -= 60 * minutes, seconds = t % 60, 
            {
                days: days < 10 ? "0" + days : days,
                hours: hours < 10 ? "0" + hours : hours,
                minutes: minutes < 10 ? "0" + minutes : minutes,
                seconds: seconds < 10 ? "0" + seconds : seconds
            };
        }
    };
} ]), angular.module("shareonride").controller("subMenuControl", [ "$scope", "$http", "authService", "$rootScope", "$state", "globalVars", function($scope, $http, authService, $rootScope, $state, globalVars) {} ]);