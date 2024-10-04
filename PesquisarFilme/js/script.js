const Ipt_pesquisa = document.querySelector("#pesquisa");
const pesquisa_list = document.querySelector(".pesquisa-list");
const resultado_grade = document.querySelector(".resultado");
let spinner_loading = document.querySelector(".loading");

//Funções
async function carregarFilmes(nomeFilme) {
    const URL = `https://www.omdbapi.com/?s=${nomeFilme}&page=1&apikey=cc2493de&language=pt-BR`;
    const res = await fetch(URL);
    const data = await res.json();
    if (data.Response === "False") {
        return;
    }
    exibirListaFilmes(data.Search);
}

function encontrarFilmes() {
    let nomeFilme = Ipt_pesquisa.value.trim();
    if (nomeFilme.length > 0) {
        pesquisa_list.classList.remove("none");
        carregarFilmes(nomeFilme);
    } else {
        pesquisa_list.classList.add("none");
    }
}

function exibirListaFilmes(filmes) {
    pesquisa_list.innerHTML = "";
    filmes.forEach((filme) => {
        let filmeListItem = document.createElement("div");
        filmeListItem.dataset.id = filme.imdbID;
        filmeListItem.classList.add("pesquisa-list-item");
        let filmePoster =
            filme.Poster !== "N/A" ? filme.Poster : "img/SemImg.png";
        filmeListItem.innerHTML = `
        <div class="pesquisa-item-thumbnail">
            <img class="pesquisa-item-img" src="${filmePoster}" alt="filme poster">
        </div>
        <div class="pesquisa-item-info">
            <h3>${filme.Title}</h3>
            <p>${filme.Year}</p>
        </div>
        `;
        pesquisa_list.appendChild(filmeListItem);
    });
    carregarDetalhesFilme();
}

function carregarDetalhesFilme() {
    const pesquisa_listfilmes = pesquisa_list.querySelectorAll(
        ".pesquisa-list-item"
    );
    pesquisa_listfilmes.forEach((filme) => {
        filme.addEventListener("click", async () => {
            pesquisa_list.classList.add("none");
            Ipt_pesquisa.value = "";

            spinner_loading.style.display = "block";
            const result = await fetch(
                `https://www.omdbapi.com/?i=${filme.dataset.id}&apikey=cc2493de&language=pt-BR`
            );
            const filmeDetalhes = await result.json();
            mostrarDetalhesFilme(filmeDetalhes);
        });
    });
}

function mostrarDetalhesFilme(detalhes) {
    resultado_grade.innerHTML = `
    <div class="poster-filme">
        <img class="img-filme" src="${
            detalhes.Poster !== "N/A" ? detalhes.Poster : "img/SemImg.png"
        }" alt="filme poster">
    </div>
    <div class="filme-info">
        <h3 class="filme-titulo">${detalhes.Title}</h3>
        <ul class="filme-data-info">
            <li class="Ano">Ano: ${detalhes.Year}</li>
            <li class="Avaliação">Avaliação: ${detalhes.Rated}</li>
            <li class="Lançamento">Lançado: ${detalhes.Released}</li>
        </ul>
        <p class="genero"><b>Gênero:</b> ${detalhes.Genre}</p>
        <p class="Escritor"><b>Escritor:</b> ${detalhes.Writer}</p>
        <p class="Atores"><b>Atores: </b>${detalhes.Actors}</p>
        <p class="plot"><b>Sinopse:</b> ${detalhes.Plot}</p>
        <p class="Linguagem"><b>Idioma:</b> ${detalhes.Language}</p>
    </div>
    `;
    resultado_grade.parentElement.classList.remove("none");
}

//Evento
Ipt_pesquisa.addEventListener("input", encontrarFilmes);
