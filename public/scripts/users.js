// Client facing scripts here
/* eslint-env jquery */

$(() => {
  $('#fetch-users').on('click', () => {
    $.ajax({
      method: 'GET',
      url: '/api/users'
    })
      .done((response) => {
        const $usersList = $('#users');
        $usersList.empty();

        for (const user of response.users) {
          $(`<li class="user">`).text(user.name).appendTo($usersList);
        }
      });
  });
});
