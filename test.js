document.addEventListener('DOMContentLoaded', function() {

    console.log('Produto de teste detectado! Iniciando atualização do JSON-LD...');

    setTimeout(function() {

        const mockReviews = [
            {
                author: "Engler",
                rating: "5",
                comment: "Produto excelente, recomendo muito! Qualidade top.",
                date: "2024-07-04"
            },
            {
                author: "Teló",
                rating: "4",
                comment: "Muito bom, chegou rápido e bem embalado.",
                date: "2024-07-03"
            },
            {
                author: "Charles",
                rating: "5",
                comment: "Superou minhas expectativas, vou comprar novamente.",
                date: "2024-07-02"
            }
        ];

        const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');
        console.log('Tags JSON-LD encontradas:', schemaScripts.length);

        if (schemaScripts.length > 0) {
            const lastSchemaScript = schemaScripts[schemaScripts.length - 1];
            console.log('Tag JSON-LD selecionada (última):', lastSchemaScript);

            try {
                const schema = JSON.parse(lastSchemaScript.innerHTML);
                console.log('Reviews originais:', schema.review);

                schema.review = mockReviews.map(review => ({
                    "@type": "Review",
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": review.rating
                    },
                    "author": {
                        "@type": "Person",
                        "name": review.author
                    },
                    "datePublished": review.date,
                    "reviewBody": review.comment
                }));

                const avgRating = mockReviews.reduce((sum, r) => sum + parseInt(r.rating), 0) / mockReviews.length;
                schema.aggregateRating = {
                    "@type": "AggregateRating",
                    "ratingValue": avgRating.toFixed(1),
                    "ratingCount": mockReviews.length.toString()
                };

                console.log('Novos reviews:', schema.review);

                const newJsonLD = JSON.stringify(schema, null, 2);
                lastSchemaScript.innerHTML = newJsonLD;

                console.log('Novo JSON-LD atualizado:');
                console.log('==========================================');
                console.log(newJsonLD);
                console.log('==========================================');

            } catch (error) {
                console.error('Erro ao processar schema:', error);
                console.error('Conteúdo que causou erro:', lastSchemaScript.innerHTML);
            }
        } else {
            console.warn('⚠️ Nenhuma tag JSON-LD encontrada na página!');
        }
    }, 6000);
});
