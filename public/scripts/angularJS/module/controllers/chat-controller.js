var ctrl = function ($scope) {
  usernames = ['A', 'B', 'C'];
  socketId = null;
  socketUrl = 'http://localhost:8000';
  let pickedSocket = null;
  $scope.namespaces = [];
  $scope.namespace = null;
  $scope.rooms = [];
  $scope.room = null;
  $scope.messages = [];
  $scope.userCount = 0;
  $scope.message = ''

  getRandom = (x) => {
    return Math.floor(Math.random()*x);
  }

  const mainSocket = io(socketUrl + '/', {
    query: {
      username: usernames[getRandom(3)]
    }
  });

  loadNamespaceRooms = () => {
    pickedSocket.on('load-ns-rooms', (rooms) => {
      $scope.$apply(() => {
        $scope.rooms = rooms;
        $scope.room = $scope.rooms[0];
        $scope.messages.length = 0;

        pickedSocket.emit('join-room', '', $scope.rooms[0]['roomTitle'], (userCount, historyMessages) => {
          $scope.$apply(() => {
            $scope.userCount = userCount;

            historyMessages.forEach((historyMessage) => {
              historyMessage.time = new Date(historyMessage.time).toLocaleString();
              $scope.messages.push(historyMessage);
            });
          });
        });
      });
    });

    pickedSocket.on('update-number-of-user', (userCount) => {
      $scope.$apply(() => {
        $scope.userCount = userCount;
      });
    });

    pickedSocket.on('message-to-client', (data) => {
      data.time = new Date(data.time).toLocaleString();
      $scope.$apply(() => {
        $scope.messages.push(data);
      })
    });
  }

  mainSocket.on('connect', () => {
    mainSocket.on('ns-list', (nsList) => {
      $scope.$apply(() => {
        $scope.namespaces = nsList;
        $scope.namespace = $scope.namespaces[0];
        pickedSocket = io(socketUrl + $scope.namespaces[0]['endpoint']);
        loadNamespaceRooms();
      });
    });
  })

  $scope.changeNamespace = (namespace) => {
    pickedSocket.close();
    $scope.namespace = namespace;
    pickedSocket = io(socketUrl + namespace.endpoint);
    loadNamespaceRooms();
  }

  $scope.changeRoom = (room) => {
    lastRoomTitle = $scope.room.roomTitle
    $scope.room = room;
    $scope.messages.length = 0;

    pickedSocket.emit('join-room', lastRoomTitle, room.roomTitle, (userCount, historyMessages) => {
      $scope.$apply(() => {
        $scope.userCount = userCount;

        historyMessages.forEach((historyMessage) => {
          historyMessage.time = new Date(historyMessage.time).toLocaleString();
          $scope.messages.push(historyMessage);
        });
      });
    });
  }

  $scope.sendMessage = (keyEvent) => {
    if (keyEvent.keyCode == 13) {
      pickedSocket.emit('newmessage-to-server', {
        namespaceEndPoint: $scope.namespace.endpoint,
        roomTitle: $scope.room.roomTitle,
        message: $scope.message
      });

      $scope.message = '';
    }
  }
}

ctrl.$inject = ['$scope'];
angular.module('TestModeApp').controller('ChatController', ctrl)