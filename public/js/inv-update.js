const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#logSubmitButton")
      updateBtn.removeAttribute("disabled")
    })